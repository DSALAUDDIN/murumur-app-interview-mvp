import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

interface Murmur {
  id: number;
  text: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
  likeCount: number;
  isLikedByMe: boolean;
}

interface MurmurCardProps {
  murmur: Murmur;
  onLikeToggle: (murmurId: number, isLiked: boolean) => void;
}

export default function MurmurCard({ murmur, onLikeToggle }: MurmurCardProps) {
  const { t } = useLanguage();

  const styles = {
    card: {
      backgroundColor: 'white',
      padding: '16px',
      borderRadius: '12px',
      marginBottom: '16px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      border: '1px solid #E1DFDA',
      fontFamily: `'Noto Serif JP', serif`,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px',
    },
    username: {
      fontWeight: 700,
      fontSize: '16px',
      color: '#4B4E6D',
      fontFamily: `'Noto Serif JP', serif`,
    },
    timestamp: {
      marginLeft: '8px',
      fontSize: '12px',
      color: '#A8A9AD',
      fontFamily: `'Noto Serif JP', serif`,
    },
    text: {
      fontSize: '14px',
      color: '#4B4E6D',
      lineHeight: 1.5,
      margin: '0 0 16px 0',
      fontFamily: `'Noto Serif JP', serif`,
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
    },
    likeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      color: murmur.isLikedByMe ? '#C73E3A' : '#A8A9AD',
      fontFamily: `'Noto Serif JP', serif`,
      transition: 'color 0.15s',
    },
    likeIcon: {
      marginRight: '4px',
    },
    likeCount: {
      color: '#4B4E6D',
      fontFamily: `'Noto Serif JP', serif`,
    },
    likeLabel: {
      marginLeft: '6px',
      fontSize: '14px',
      color: '#A8A9AD',
      fontFamily: `'Noto Serif JP', serif`,
    }
  };

  const handleLikeClick = () => {
    onLikeToggle(murmur.id, !murmur.isLikedByMe);
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <Link to={`/profile/${murmur.user.id}`} style={{ textDecoration: 'none' }}>
          <span style={styles.username}>{murmur.user.username}</span>
        </Link>
        <span style={styles.timestamp}>
          {t.postedAt ? `${t.postedAt}: ` : ''}{new Date(murmur.createdAt).toLocaleString()}
        </span>
      </div>
      <p style={styles.text}>{murmur.text}</p>
      <div style={styles.footer}>
        <button onClick={handleLikeClick} style={styles.likeButton} aria-label={murmur.isLikedByMe ? t.unlike : t.like}>
          <svg style={styles.likeIcon} width="16" height="16" viewBox="0 0 24 24" fill={murmur.isLikedByMe ? '#C73E3A' : 'none'} stroke={murmur.isLikedByMe ? '#C73E3A' : '#A8A9AD'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span style={styles.likeCount}>{murmur.likeCount}</span>
          <span style={styles.likeLabel}>{t.likes}</span>
        </button>
      </div>
    </div>
  );
}
