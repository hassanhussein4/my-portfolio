import React, { useState, useEffect } from 'react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const prefs = { necessary: true, analytics: true, marketing: true };
    setPreferences(prefs);
    saveConsent(prefs);
    setShowBanner(false);
  };

  const handleAcceptSelected = () => {
    saveConsent(preferences);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const prefs = { necessary: true, analytics: false, marketing: false };
    setPreferences(prefs);
    saveConsent(prefs);
    setShowBanner(false);
  };

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie_consent', JSON.stringify({
      ...prefs,
      timestamp: new Date().toISOString(),
    }));
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return;
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!showBanner) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.banner}>
        <h3 style={styles.title}>Cookie-Einstellungen</h3>
        <p style={styles.description}>
          Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer
          Website zu bieten. Notwendige Cookies sind für den Betrieb erforderlich.
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={styles.linkButton}
          >
            {showDetails ? 'Weniger anzeigen' : 'Details anzeigen'}
          </button>
        </p>

        {showDetails && (
          <div style={styles.options}>
            <label style={styles.option}>
              <input
                type="checkbox"
                checked={preferences.necessary}
                disabled
              />
              <span>Notwendig (immer aktiv)</span>
            </label>
            <label style={styles.option}>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={() => togglePreference('analytics')}
              />
              <span>Analyse & Statistik</span>
            </label>
            <label style={styles.option}>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={() => togglePreference('marketing')}
              />
              <span>Marketing</span>
            </label>
          </div>
        )}

        <div style={styles.actions}>
          <button onClick={handleRejectAll} style={styles.buttonSecondary}>
            Alle ablehnen
          </button>
          <button onClick={handleAcceptSelected} style={styles.buttonSecondary}>
            Auswahl bestätigen
          </button>
          <button onClick={handleAcceptAll} style={styles.buttonPrimary}>
            Alle akzeptieren
          </button>
        </div>

        <p style={styles.footer}>
          <a href="/datenschutz" style={styles.link}>Datenschutzerklärung</a>
          {' · '}
          <a href="/impressum" style={styles.link}>Impressum</a>
        </p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
  },
  banner: {
    backgroundColor: '#fff',
    maxWidth: '800px',
    width: '100%',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  description: {
    margin: '0 0 16px 0',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#4a4a4a',
  },
  options: {
    margin: '16px 0',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 0',
    fontSize: '14px',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '16px',
  },
  buttonPrimary: {
    padding: '10px 24px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    flex: '1 1 auto',
    minWidth: '120px',
  },
  buttonSecondary: {
    padding: '10px 24px',
    backgroundColor: '#e5e7eb',
    color: '#1a1a1a',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    flex: '1 1 auto',
    minWidth: '120px',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '0 0 0 8px',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '13px',
  },
  footer: {
    margin: '16px 0 0 0',
    fontSize: '13px',
    color: '#6b7280',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '16px',
  },
};

// ✅ THIS IS THE CRITICAL LINE THAT WAS MISSING:
export default CookieBanner;