import { useState, useEffect } from 'react';
import api from '../services/api';
import MurmurCard from '../components/MurmurCard';
import Pagination from '../components/Pagination';
import { useLanguage } from '../context/LanguageContext';

interface Murmur {
  id: number;
  text: string;
  createdAt: string;
  user: { id: number; username: string };
  likeCount: number;
  isLikedByMe: boolean;
}

export default function DiscoverPage() {
  const [murmurs, setMurmurs] = useState<Murmur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchGlobalFeed = async (page: number) => {
      try {
        setLoading(true);
        setError(null);
        // This is the key difference: calling /api/murmurs instead of /api/murmurs/timeline
        const response = await api.get(`/murmurs?page=${page}&limit=10`);
        setMurmurs(response.data.data);
        setCurrentPage(response.data.page);
        setLastPage(response.data.last_page);
      } catch (err) {
        setError(t.discoverFetchError ?? 'Failed to fetch the global feed. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalFeed(currentPage);
  }, [currentPage, t.discoverFetchError]);

  const handleLikeToggle = async (murmurId: number, newIsLiked: boolean) => {
    setMurmurs(currentMurmurs =>
      currentMurmurs.map(murmur =>
        murmur.id === murmurId
          ? { ...murmur, isLikedByMe: newIsLiked, likeCount: newIsLiked ? murmur.likeCount + 1 : murmur.likeCount - 1 }
          : murmur
      )
    );
    try {
      if (newIsLiked) await api.post(`/murmurs/${murmurId}/like`);
      else await api.delete(`/murmurs/${murmurId}/unlike`);
    } catch (err) { console.error('Failed to toggle like:', err); }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const styles = {
    container: { maxWidth: '600px', margin: '24px auto', padding: '0 16px' },
    title: { fontSize: '24px', fontWeight: 700, color: '#4B4E6D', marginBottom: '24px', fontFamily: `'Noto Serif JP', serif` },
    message: { textAlign: 'center' as 'center', color: '#A8A9AD', fontFamily: `'Noto Serif JP', serif` }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{t.discoverPageTitle ?? 'Discover Murmurs'}</h1>
      {loading && <p style={styles.message}>{t.loading ?? 'Loading...'}</p>}
      {error && <p style={{ ...styles.message, color: '#C73E3A' }}>{error}</p>}
      {!loading && !error && (
        <div>
          {murmurs.length > 0 ? (
            murmurs.map((murmur) => (
              <MurmurCard key={murmur.id} murmur={murmur} onLikeToggle={handleLikeToggle} />
            ))
          ) : (
            <p style={styles.message}>{t.noMurmursFound ?? 'No murmurs found.'}</p>
          )}
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
