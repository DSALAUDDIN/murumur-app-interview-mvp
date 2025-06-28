import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface Notification {
  id: number;
  type: string;
  isRead: boolean;
  sender: { username: string };
  murmur: { id: number; text: string } | null;
  createdAt: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchNotifs = () => {
      api.get('/notifications').then(res => {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }).catch(console.error);
    };
    fetchNotifs();
    const intervalId = setInterval(fetchNotifs, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.isRead) {
      try {
        await api.post(`/notifications/${notif.id}/read`);
        setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
        setNotifications(prev => prev.map(n => (n.id === notif.id ? { ...n, isRead: true } : n)));
      } catch (error) {
        console.error("Failed to mark notification as read", error);
      }
    }
    setIsOpen(false);
    if (notif.murmur) {
      navigate(`/murmur/${notif.murmur.id}`);
    }
  };

  const styles = {
    container: { position: 'relative' as 'relative', marginRight: '20px' },
    button: { background: 'none', border: 'none', cursor: 'pointer', position: 'relative' as 'relative' },
    badge: { position: 'absolute' as 'absolute', top: '-5px', right: '-5px', background: '#C73E3A', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' },
    dropdown: { position: 'absolute' as 'absolute', top: '40px', right: '0', width: '320px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid #E1DFDA', zIndex: 100, maxHeight: '400px', overflowY: 'auto' as 'auto' },
    notificationItem: { padding: '12px', borderBottom: '1px solid #E1DFDA', cursor: 'pointer', color: '#4B4E6D', fontFamily: `'Noto Serif JP', serif` },
    unreadItem: { backgroundColor: '#FADADD' },
    noNotifs: { padding: '16px', textAlign: 'center' as 'center', color: '#A8A9AD', fontFamily: `'Noto Serif JP', serif` }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => setIsOpen(!isOpen)} style={styles.button} aria-label={t.notifications ?? "Notifications"}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4B4E6D" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
      </button>
      {isOpen && (
        <div style={styles.dropdown}>
          {notifications.length > 0 ? (
            notifications.map(notif => (
              <div key={notif.id} onClick={() => handleNotificationClick(notif)} style={{ ...styles.notificationItem, ...(!notif.isRead ? styles.unreadItem : {}) }}>
                <strong>{notif.sender.username}</strong> {t.notificationMurmur ?? "posted a new murmur."}
              </div>
            ))
          ) : (
            <div style={styles.noNotifs}>{t.noNotifications ?? "No notifications yet."}</div>
          )}
        </div>
      )}
    </div>
  );
}
