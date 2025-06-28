import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const colors = {
  primaryAccent: '#C73E3A',
  primaryText: '#4B4E6D',
  background: '#F7F4ED',
  border: '#E1DFDA',
  washi: 'url("https://www.transparenttextures.com/patterns/washi.png")', // Washi paper texture
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post('/auth/login', { email, password });

      login(response.data.accessToken);

      navigate('/');
    } catch (err: any) {
      setError(t.loginError ?? 'Invalid email or password. Please try again.');
      console.error('Login failed:', err);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: `${colors.washi}, ${colors.background}`,
      color: colors.primaryText,
      fontFamily: `'Noto Serif JP', serif`,
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      width: '340px',
      padding: '40px 32px 32px 32px',
      borderRadius: '16px',
      background: 'rgba(255,255,255,0.98)',
      border: `1.5px solid ${colors.border}`,
      boxShadow: '0 8px 32px rgba(76, 49, 39, 0.06)',
      position: 'relative' as 'relative',
    },
    title: {
      fontSize: '28px',
      fontWeight: 700,
      textAlign: 'center' as 'center',
      marginBottom: '18px',
      letterSpacing: '0.04em',
      color: colors.primaryText,
      fontFamily: `'Noto Serif JP', serif`,
      borderBottom: `2.5px solid ${colors.primaryAccent}`,
      paddingBottom: '10px',
      marginLeft: '-18px',
      marginRight: '-18px',
    },
    input: {
      padding: '14px',
      marginBottom: '20px',
      fontSize: '15px',
      borderRadius: '10px',
      border: `1.5px solid ${colors.border}`,
      color: colors.primaryText,
      background: 'rgba(250, 237, 205, 0.15)',
      fontFamily: `'Noto Serif JP', serif`,
      outline: 'none',
      transition: 'border 0.23s',
    },
    button: {
      padding: '14px',
      fontSize: '17px',
      fontWeight: 700,
      color: 'white',
      background: colors.primaryAccent,
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontFamily: `'Noto Serif JP', serif`,
      letterSpacing: '0.05em',
      marginTop: '4px',
      boxShadow: '0 2px 8px rgba(199,62,58,0.10)',
      transition: 'background 0.25s',
    },
    errorMessage: {
      textAlign: 'center' as 'center',
      marginTop: '18px',
      color: colors.primaryAccent,
      background: '#fff3f3',
      padding: '10px',
      borderRadius: '8px',
      border: `1.5px solid ${colors.primaryAccent}`,
      fontWeight: 600,
      fontFamily: `'Noto Serif JP', serif`,
      fontSize: '14px',
    },
    registerPrompt: {
      marginTop: '20px',
      textAlign: 'center' as 'center',
      color: colors.primaryText,
      fontFamily: `'Noto Serif JP', serif`,
      fontSize: '15px',
    },
    registerLink: {
      color: colors.primaryAccent,
      textDecoration: 'underline',
      marginLeft: '4px',
      fontWeight: 700,
      cursor: 'pointer',
      fontFamily: `'Noto Serif JP', serif`,
      fontSize: '15px',
    },
    label: {
      fontWeight: 600,
      marginBottom: '4px',
      color: colors.primaryText,
      letterSpacing: '0.02em',
      fontSize: '15px',
      fontFamily: `'Noto Serif JP', serif`,
    },
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit} autoComplete="on">
        <h1 style={styles.title}>{t.loginTitle ?? 'Log in to Murmur'}</h1>
        <label style={styles.label} htmlFor="email">{t.loginEmailLabel ?? "Email"}</label>
        <input
          id="email"
          type="email"
          placeholder={t.loginEmailPlaceholder ?? "Email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
          autoComplete="email"
        />
        <label style={styles.label} htmlFor="password">{t.loginPasswordLabel ?? "Password"}</label>
        <input
          id="password"
          type="password"
          placeholder={t.loginPasswordPlaceholder ?? "Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
          autoComplete="current-password"
        />
        <button type="submit" style={styles.button}>
          {t.loginButton ?? "Log In"}
        </button>
        {error && <p style={styles.errorMessage}>{error}</p>}
        <div style={styles.registerPrompt}>
          {t.notRegisteredPrompt ?? "Not registered?"}
          <Link to="/register" style={styles.registerLink}>
            {t.registerHere ?? "Register here"}
          </Link>
        </div>
      </form>
    </div>
  );
}
