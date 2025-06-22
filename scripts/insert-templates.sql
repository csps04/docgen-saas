-- Script pour insérer les modèles de documents par défaut
-- À exécuter après le script de configuration de la base de données

-- Supprimer les modèles existants (optionnel)
-- DELETE FROM public.document_templates;

-- Insérer le modèle Contrat de Prestation
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
);

-- Insérer le modèle CGV
INSERT INTO public.document_templates (name, description, category, type, fields, template) VALUES
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
);

-- Insérer le modèle Devis
INSERT INTO public.document_templates (name, description, category, type, fields, template) VALUES
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
);

-- Insérer le modèle Facture
INSERT INTO public.document_templates (name, description, category, type, fields, template) VALUES
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

-- Message de confirmation
SELECT 'Modèles de documents insérés avec succès !' as status; 