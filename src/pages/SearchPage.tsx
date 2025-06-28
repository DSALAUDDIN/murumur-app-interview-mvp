import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface User {
  id: number;
  username: string;
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const { t } = useLanguage();

  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/users/search?q=${query}`);
        setResults(response.data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  const styles = {
    container: { maxWidth: '600px', margin: '24px auto', padding: '0 16px', fontFamily: `'Noto Serif JP', serif` },
    title: { fontSize: '24px', fontWeight: 700, color: '#4B4E6D', marginBottom: '24px' },
    message: { textAlign: 'center' as const, color: '#A8A9AD', fontFamily: `'Noto Serif JP', serif` },
    resultItem: { backgroundColor: 'white', padding: '16px', borderRadius: '12px', marginBottom: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', border: '1px solid #E1DFDA' },
    usernameLink: { textDecoration: 'none', color: '#4B4E6D', fontWeight: 600 }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        {t.searchResultsTitle
          ? t.searchResultsTitle.replace('{query}', query ?? '')
          : `Search Results for "${query}"`}
      </h1>
      {loading && <p style={styles.message}>{t.searching ?? 'Searching...'}</p>}
      {!loading && results.length > 0 && (
        <div>
          {results.map(user => (
            <div key={user.id} style={styles.resultItem}>
              <Link to={`/profile/${user.id}`} style={styles.usernameLink}>
                {user.username}
              </Link>
            </div>
          ))}
        </div>
      )}
      {!loading && results.length === 0 && (
        <p style={styles.message}>{t.noUsersFound ?? 'No users found.'}</p>
      )}
    </div>
  );
}
