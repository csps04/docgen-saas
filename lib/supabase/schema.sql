-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE document_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE document_type AS ENUM ('contrat-prestation', 'cgv', 'devis', 'facture', 'autre');

-- Create users table (extends auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document_templates table
CREATE TABLE public.document_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    type document_type NOT NULL,
    fields JSONB NOT NULL, -- Array of form fields
    template TEXT NOT NULL, -- Handlebars template
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    template_id UUID REFERENCES public.document_templates(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL, -- Generated content
    data JSONB NOT NULL, -- Form data used to generate the document
    status document_status DEFAULT 'draft',
    file_url TEXT, -- URL to generated PDF if exported
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_documents_template_id ON public.documents(template_id);
CREATE INDEX idx_documents_status ON public.documents(status);
CREATE INDEX idx_documents_created_at ON public.documents(created_at DESC);
CREATE INDEX idx_document_templates_type ON public.document_templates(type);
CREATE INDEX idx_document_templates_active ON public.document_templates(is_active);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for documents
CREATE POLICY "Users can view own documents" ON public.documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON public.documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON public.documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON public.documents
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for document_templates (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view active templates" ON public.document_templates
    FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_templates_updated_at BEFORE UPDATE ON public.document_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default document templates
INSERT INTO public.document_templates (name, description, category, type, fields, template) VALUES
(
    'Contrat de Prestation',
    'Contrat type pour la prestation de services',
    'Contrats',
    'contrat-prestation',
    '[
        {"id": "client_name", "label": "Nom du client", "type": "text", "required": true},
        {"id": "client_address", "label": "Adresse du client", "type": "textarea", "required": true},
        {"id": "service_description", "label": "Description du service", "type": "textarea", "required": true},
        {"id": "price", "label": "Prix HT", "type": "number", "required": true},
        {"id": "start_date", "label": "Date de début", "type": "date", "required": true},
        {"id": "end_date", "label": "Date de fin", "type": "date", "required": false}
    ]',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Contrat de Prestation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .signature { margin-top: 50px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>CONTRAT DE PRESTATION DE SERVICES</h1>
    </div>
    
    <div class="section">
        <h2>1. PARTIES</h2>
        <p><strong>Prestataire :</strong> {{company_name}}</p>
        <p><strong>Client :</strong> {{client_name}}</p>
        <p><strong>Adresse :</strong> {{client_address}}</p>
    </div>
    
    <div class="section">
        <h2>2. OBJET</h2>
        <p>Le présent contrat a pour objet la prestation de services suivante :</p>
        <p>{{service_description}}</p>
    </div>
    
    <div class="section">
        <h2>3. DURÉE</h2>
        <p>Ce contrat prend effet à compter du {{start_date}} et se termine le {{end_date}}.</p>
    </div>
    
    <div class="section">
        <h2>4. TARIF</h2>
        <p>Le montant de la prestation s''élève à {{price}} € HT.</p>
    </div>
    
    <div class="signature">
        <p>Fait à _________________, le _________________</p>
        <p>Signature du prestataire : _________________</p>
        <p>Signature du client : _________________</p>
    </div>
</body>
</html>'
),
(
    'Conditions Générales de Vente',
    'CGV standard pour votre activité commerciale',
    'Conditions',
    'cgv',
    '[
        {"id": "company_name", "label": "Nom de l''entreprise", "type": "text", "required": true},
        {"id": "company_address", "label": "Adresse de l''entreprise", "type": "textarea", "required": true},
        {"id": "siret", "label": "Numéro SIRET", "type": "text", "required": true},
        {"id": "activity", "label": "Activité principale", "type": "text", "required": true},
        {"id": "contact_email", "label": "Email de contact", "type": "email", "required": true}
    ]',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Conditions Générales de Vente</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>CONDITIONS GÉNÉRALES DE VENTE</h1>
    </div>
    
    <div class="section">
        <h2>1. PRÉSENTATION DE L''ENTREPRISE</h2>
        <p><strong>Raison sociale :</strong> {{company_name}}</p>
        <p><strong>Adresse :</strong> {{company_address}}</p>
        <p><strong>SIRET :</strong> {{siret}}</p>
        <p><strong>Activité :</strong> {{activity}}</p>
        <p><strong>Contact :</strong> {{contact_email}}</p>
    </div>
    
    <div class="section">
        <h2>2. OBJET</h2>
        <p>Les présentes conditions générales de vente s''appliquent à toutes les prestations conclues par {{company_name}} auprès de ses clients professionnels et particuliers.</p>
    </div>
    
    <div class="section">
        <h2>3. PRIX</h2>
        <p>Les prix de nos prestations sont exprimés en euros et hors taxes. La TVA applicable est de 20%.</p>
    </div>
    
    <div class="section">
        <h2>4. MODALITÉS DE PAIEMENT</h2>
        <p>Le règlement des prestations s''effectue selon les modalités définies dans nos devis et factures.</p>
    </div>
</body>
</html>'
),
(
    'Devis',
    'Devis professionnel avec conditions',
    'Commercial',
    'devis',
    '[
        {"id": "client_name", "label": "Nom du client", "type": "text", "required": true},
        {"id": "client_address", "label": "Adresse du client", "type": "textarea", "required": true},
        {"id": "devis_number", "label": "Numéro de devis", "type": "text", "required": true},
        {"id": "validity_days", "label": "Validité (en jours)", "type": "number", "required": true},
        {"id": "services", "label": "Services proposés", "type": "textarea", "required": true},
        {"id": "total_ht", "label": "Total HT", "type": "number", "required": true}
    ]',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Devis</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .total { font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>DEVIS</h1>
        <p>N° {{devis_number}}</p>
    </div>
    
    <div class="section">
        <h2>CLIENT</h2>
        <p><strong>Nom :</strong> {{client_name}}</p>
        <p><strong>Adresse :</strong> {{client_address}}</p>
    </div>
    
    <div class="section">
        <h2>PRESTATIONS</h2>
        <p>{{services}}</p>
    </div>
    
    <div class="total">
        <p>Total HT : {{total_ht}} €</p>
        <p>TVA (20%) : {{total_ht * 0.2}} €</p>
        <p>Total TTC : {{total_ht * 1.2}} €</p>
    </div>
    
    <div class="section">
        <p><strong>Validité :</strong> Ce devis est valable {{validity_days}} jours à compter de sa date d''émission.</p>
    </div>
</body>
</html>'
),
(
    'Facture',
    'Facture avec mentions légales',
    'Commercial',
    'facture',
    '[
        {"id": "invoice_number", "label": "Numéro de facture", "type": "text", "required": true},
        {"id": "client_name", "label": "Nom du client", "type": "text", "required": true},
        {"id": "client_address", "label": "Adresse du client", "type": "textarea", "required": true},
        {"id": "services", "label": "Services facturés", "type": "textarea", "required": true},
        {"id": "total_ht", "label": "Total HT", "type": "number", "required": true},
        {"id": "payment_terms", "label": "Conditions de paiement", "type": "text", "required": true}
    ]',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Facture</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .total { font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FACTURE</h1>
        <p>N° {{invoice_number}}</p>
        <p>Date : {{formatDate now}}</p>
    </div>
    
    <div class="section">
        <h2>CLIENT</h2>
        <p><strong>Nom :</strong> {{client_name}}</p>
        <p><strong>Adresse :</strong> {{client_address}}</p>
    </div>
    
    <div class="section">
        <h2>PRESTATIONS</h2>
        <p>{{services}}</p>
    </div>
    
    <div class="total">
        <p>Total HT : {{total_ht}} €</p>
        <p>TVA (20%) : {{total_ht * 0.2}} €</p>
        <p>Total TTC : {{total_ht * 1.2}} €</p>
    </div>
    
    <div class="section">
        <p><strong>Conditions de paiement :</strong> {{payment_terms}}</p>
    </div>
</body>
</html>'
); 