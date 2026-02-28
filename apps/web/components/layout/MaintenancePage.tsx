export default function MaintenancePage() {
  return (
    <html lang='en'>
      <body
        style={{
          margin: 0,
          fontFamily: 'sans-serif',
          background: '#0f0f0f',
          color: '#fff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
        }}
      >
        <div>
          <h1 style={{ color: '#f0a500', fontSize: '2rem' }}>
            🔧 Under Maintenance
          </h1>
          <p style={{ color: '#aaa', marginTop: '1rem' }}>
            We're performing scheduled maintenance. We'll be back shortly.
          </p>
        </div>
      </body>
    </html>
  );
}
