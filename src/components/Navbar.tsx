import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Notifications from './Notifications';
import { useLanguage } from '../context/LanguageContext';

// Japanese-inspired color palette & patterns
const earthBeige = '#F5ECD9';
const sakuraPink = '#F9CADA';
const indigo = '#353B5D';
const darkBrown = '#3A2A1B';
const washiPattern =
  'repeating-linear-gradient(135deg,rgba(246,241,230,0.3) 0 2px,transparent 2px 8px),repeating-linear-gradient(45deg,rgba(255,255,255,0.12) 0 2px,transparent 2px 8px)';
const borderColor = '#E6DED7';

export default function Navbar() {
  const { isAuthenticated, logout, userId } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { t, lang, setLang } = useLanguage();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
      setSearchQuery('');
    }
  };

  return (
    <nav
      style={{
        background: `${earthBeige}`,
        backgroundImage: washiPattern,
        borderBottom: `2px solid ${borderColor}`,
        padding: '0 0',
        boxShadow: '0 2px 12px 0 rgba(58, 42, 27, 0.04)',
        fontFamily: `'Noto Serif JP', serif`,
        letterSpacing: '0.01em',
        minHeight: 68,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 36px',
          height: 68,
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: '1.7em',
            color: indigo,
            textDecoration: 'none',
            fontWeight: 700,
            letterSpacing: '0.12em',
            borderBottom: `3px solid ${sakuraPink}`,
            padding: '0.2em 0.5em',
            borderRadius: '0 0 10px 10px',
            boxShadow: '0 2px 0 0 #f7e1e7',
            background: 'rgba(249,202,218,0.07)',
            fontFamily: `'Noto Serif JP', serif`,
            transition: 'background 0.18s, color 0.19s',
          }}
        >
          {t.brand}
        </Link>
        {isAuthenticated && (
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '36px',
              marginRight: 'auto',
              background: 'rgba(255,255,255,0.35)',
              borderRadius: '16px',
              border: `1.5px solid ${borderColor}`,
              boxShadow: '0 1px 2px 0 rgba(58,42,27,0.07)',
              padding: '0 8px',
              minWidth: 220,
            }}
          >
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '7px 12px',
                fontSize: '15px',
                border: 'none',
                background: 'none',
                outline: 'none',
                color: indigo,
                fontFamily: `'Noto Serif JP', serif`,
                width: 120,
              }}
            />
            <button
              type="submit"
              style={{
                marginLeft: '8px',
                padding: '6px 15px',
                color: 'white',
                background: sakuraPink,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontFamily: `'Noto Serif JP', serif`,
                boxShadow: '0 2px 0 0 #e3b3b7',
                transition: 'background 0.18s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#e58eaf')}
              onMouseOut={e => (e.currentTarget.style.background = sakuraPink)}
            >
              {t.search}
            </button>
          </form>
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            paddingLeft: '38px',
          }}
        >
          {isAuthenticated ? (
            <>
              <NavLinkJp to="/" label={t.timeline} />
              <NavLinkJp to="/discover" label={t.discover} />
              <NavLinkJp to={`/profile/${userId}`} label={t.myProfile} />
              <Notifications />
              <button
                onClick={handleLogout}
                style={{
                  color: darkBrown,
                  background: 'none',
                  border: `1.4px solid ${borderColor}`,
                  borderRadius: '7px',
                  fontWeight: 500,
                  fontFamily: `'Noto Serif JP', serif`,
                  padding: '7px 17px',
                  marginLeft: '7px',
                  cursor: 'pointer',
                  transition: 'background 0.18s, color 0.18s',
                  letterSpacing: '0.08em',
                  fontSize: '1em',
                  boxShadow: '0 1px 0 0 #d7c7bc',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#f2d5ce';
                  e.currentTarget.style.color = indigo;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = darkBrown;
                }}
              >
                {t.logout}
              </button>
            </>
          ) : (
            <>
              <NavLinkJp to="/login" label={t.login} />
              <NavLinkJp to="/register" label={t.register} />
            </>
          )}
          {/* Language Switcher */}
          <button
            style={{
              marginLeft: 12,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: `'Noto Serif JP', serif`,
              fontWeight: 500,
              color: indigo,
              fontSize: '1em',
              letterSpacing: '0.07em',
              padding: '0.26em 0.7em'
            }}
            onClick={() => setLang(lang === 'en' ? 'ja' : 'en')}
            aria-label="Switch language"
          >
            {lang === 'en' ? '日本語' : 'English'}
          </button>
        </div>
      </div>
      {/* Subtle bottom border for vertical rhythm */}
      <div
        style={{
          borderBottom: `1.5px solid ${borderColor}`,
          opacity: 0.6,
          margin: '0 28px',
        }}
      />
    </nav>
  );
}

// A reusable nav link styled in Japanese aesthetic with underline hover
function NavLinkJp({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      style={{
        color: '#3A2A1B',
        textDecoration: 'none',
        fontWeight: 500,
        fontFamily: `'Noto Serif JP', serif`,
        fontSize: '1.08em',
        padding: '0.38em 0.9em 0.32em 0.9em',
        borderBottom: '2px solid transparent',
        borderRadius: 0,
        transition: 'color 0.15s, border-color 0.18s',
        verticalAlign: 'middle',
        position: 'relative',
        margin: '0 2px',
      }}
      onMouseOver={e => {
        e.currentTarget.style.borderBottom = `2px solid ${sakuraPink}`;
        e.currentTarget.style.color = '#C73E3A';
      }}
      onMouseOut={e => {
        e.currentTarget.style.borderBottom = '2px solid transparent';
        e.currentTarget.style.color = '#3A2A1B';
      }}
    >
      {label}
    </Link>
  );
}
