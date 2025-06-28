import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

// Design System Colors
const colors = {
  primaryAccent: '#C73E3A',
  primaryText: '#4B4E6D',
  secondaryText: '#A8A9AD',
  background: '#F7F4ED',
  border: '#E1DFDA',
  buttonHover: '#A8322E',
  washi: 'url("https://www.transparenttextures.com/patterns/washi.png")',
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await api.post('/auth/register', { username, email, password });
      setSuccess(t.registerSuccess ?? 'Registration successful! Redirecting to login...');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        const messages = Array.isArray(err.response.data.message)
          ? err.response.data.message.join(', ')
          : err.response.data.message;
        setError(messages);
      } else {
        setError(t.registerUnexpectedError ?? 'An unexpected error occurred. Please try again.');
      }
      console.error('Registration failed:', err);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: `${colors.washi}, ${colors.background}`,
      color: colors.primaryText,
      fontFamily: `'Noto Serif JP', serif`,
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      width: '340px',
      padding: '40px 32px 32px 32px',
      borderRadius: '16px',
      background: 'rgba(255,255,255,0.98)',
      border: `1.5px solid ${colors.border}`,
      boxShadow: '0 8px 32px rgba(76, 49, 39, 0.06)',
      position: 'relative' as const,
    },
    title: {
      fontSize: '28px',
      fontWeight: 700,
      textAlign: 'center' as const,
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
    message: {
      textAlign: 'center' as const,
      marginTop: '16px',
    },
    errorMessage: {
      color: colors.primaryAccent,
      fontWeight: 600,
      background: '#fff3f3',
      padding: '10px',
      borderRadius: '8px',
      border: `1.5px solid ${colors.primaryAccent}`,
      fontFamily: `'Noto Serif JP', serif`,
      fontSize: '14px',
    },
    successMessage: {
      color: '#7CB518',
      fontWeight: 600,
      background: '#ecf9e8',
      padding: '10px',
      borderRadius: '8px',
      border: `1.5px solid #7CB518`,
      fontFamily: `'Noto Serif JP', serif`,
      fontSize: '14px',
    },
    loginPrompt: {
      marginTop: '20px',
      textAlign: 'center' as const,
      color: colors.primaryText,
      fontFamily: `'Noto Serif JP', serif`,
      fontSize: '15px',
    },
    loginLink: {
      color: colors.primaryAccent,
      textDecoration: 'underline',
      marginLeft: '4px',
      fontWeight: 700,
      cursor: 'pointer',
      fontFamily: `'Noto Serif JP', serif`,
      fontSize: '15px',
    },
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h1 style={styles.title}>{t.registerTitle ?? 'Create your Murmur account'}</h1>
        <input
          type="text"
          placeholder={t.registerUsernamePlaceholder ?? "Username"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="email"
          placeholder={t.registerEmailPlaceholder ?? "Email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder={t.registerPasswordPlaceholder ?? "Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          {t.registerButton ?? "Sign Up"}
        </button>
        {error && <p style={{ ...styles.message, ...styles.errorMessage }}>{error}</p>}
        {success && <p style={{ ...styles.message, ...styles.successMessage }}>{success}</p>}
        <div style={styles.loginPrompt}>
          {t.alreadyRegisteredPrompt ?? "Already signed up?"}
          <Link to="/login" style={styles.loginLink}>
            {t.loginHere ?? "Login here"}
          </Link>
        </div>
      </form>
    </div>
  );
}
