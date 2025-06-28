import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import MurmurCard from '../components/MurmurCard';
import { useLanguage } from '../context/LanguageContext';

interface Murmur {
  id: number;
  text: string;
  createdAt: string;
  user: { id: number; username: string };
  likeCount: number;
  isLikedByMe: boolean;
}

export default function MurmurDetailPage() {
  const { murmurId } = useParams<{ murmurId: string }>();
  const [murmur, setMurmur] = useState<Murmur | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (!murmurId) return;
    api.get(`/murmurs/${murmurId}`)
      .then(res => setMurmur(res.data))
      .catch(err => setMurmur(null))
      .finally(() => setLoading(false));
  }, [murmurId]);

  const handleLikeToggle = async (murmurId: number, newIsLiked: boolean) => {
    if (!murmur) return;
    setMurmur(prevMurmur => prevMurmur ? {
      ...prevMurmur,
      isLikedByMe: newIsLiked,
      likeCount: newIsLiked ? prevMurmur.likeCount + 1 : prevMurmur.likeCount - 1,
    } : null);
    try {
      if (newIsLiked) await api.post(`/murmurs/${murmurId}/like`);
      else await api.delete(`/murmurs/${murmurId}/unlike`);
    } catch (err) { console.error('Like toggle failed:', err); }
  };

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '28px auto',
      padding: '0 16px',
      fontFamily: `'Noto Serif JP', serif`,
    },
    message: {
      textAlign: 'center' as const,
      marginTop: '60px',
      color: '#A8A9AD',
      fontSize: '18px',
      fontFamily: `'Noto Serif JP', serif`,
      letterSpacing: '0.02em',
    },
  };

  if (loading) return <div style={styles.message}>{t.loading ?? 'Loading murmur...'}</div>;
  if (!murmur) return <div style={styles.message}>{t.murmurNotFound ?? 'Murmur not found.'}</div>;

  return (
    <div style={styles.container}>
      <MurmurCard murmur={murmur} onLikeToggle={handleLikeToggle} />
    </div>
  );
}
