import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            marginBottom: 20,
          }}
        >
          📄 DocGen SaaS
        </div>
        <div
          style={{
            fontSize: 32,
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Générateur de Documents Professionnels
        </div>
        <div
          style={{
            fontSize: 24,
            marginTop: 20,
            opacity: 0.9,
          }}
        >
          Contrats • CGV • Devis • Factures
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
} 