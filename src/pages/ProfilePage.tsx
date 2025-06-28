import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import MurmurCard from '../components/MurmurCard';
import FollowListModal from '../components/FollowListModal';
import { useLanguage } from '../context/LanguageContext';

interface Murmur {
  id: number;
  text: string;
  createdAt: string;
  user: { id: number; username: string };
  likeCount: number;
  isLikedByMe: boolean;
}

interface ProfileData {
  id: number;
  username: string;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  murmurs: Murmur[];
}

export default function ProfilePage() {
  const { userId: currentUserId } = useAuth();
  const { userId: profileUserId } = useParams<{ userId: string }>();
  const { t } = useLanguage();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'following' | 'followers' | null>(null);

  const isOwnProfile = Number(profileUserId) === currentUserId;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileUserId) return;
      setLoading(true);
      try {
        const response = await api.get(`/users/${profileUserId}`);
        setProfile(response.data);
      } catch (err) {
        setError(t.profileLoadError ?? 'Failed to load profile.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUserId]);

  const handleFollowToggle = async () => {
    if (!profile) return;
    const originalProfile = { ...profile };
    setProfile({
      ...profile,
      isFollowing: !profile.isFollowing,
      followerCount: profile.isFollowing ? profile.followerCount - 1 : profile.followerCount + 1,
    });
    try {
      if (profile.isFollowing) await api.delete(`/users/${profile.id}/follow`);
      else await api.post(`/users/${profile.id}/follow`);
    } catch (err) {
      console.error('Follow toggle failed:', err);
      setProfile(originalProfile);
    }
  };

  const handleDeleteMurmur = async (murmurId: number) => {
    if (!profile) return;
    const originalMurmurs = [...profile.murmurs];
    setProfile({ ...profile, murmurs: profile.murmurs.filter(m => m.id !== murmurId) });
    try {
      await api.delete(`/me/murmurs/${murmurId}`);
    } catch (err) {
      console.error('Delete failed:', err);
      setProfile({ ...profile, murmurs: originalMurmurs });
    }
  };

  const handleLikeToggle = async (murmurId: number, newIsLiked: boolean) => {
    if (!profile) return;
    setProfile({
      ...profile,
      murmurs: profile.murmurs.map(m =>
        m.id === murmurId
          ? { ...m, isLikedByMe: newIsLiked, likeCount: newIsLiked ? m.likeCount + 1 : m.likeCount - 1 }
          : m
      ),
    });
    try {
      if (newIsLiked) await api.post(`/murmurs/${murmurId}/like`);
      else await api.delete(`/murmurs/${murmurId}/unlike`);
    } catch (err) { console.error('Like toggle failed:', err); }
  };

  const styles = {
    container: { maxWidth: '700px', margin: '24px auto', padding: '0 16px', fontFamily: `'Noto Serif JP', serif` },
    header: { padding: '24px', backgroundColor: 'white', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' },
    username: { fontSize: '28px', color: '#4B4E6D', fontWeight: 700 },
    stats: { display: 'flex', gap: '20px', marginTop: '16px' },
    statItem: { cursor: 'pointer', color: '#4B4E6D' },
    followButton: { padding: '8px 16px', fontSize: '14px', fontWeight: 600, color: 'white', backgroundColor: '#C73E3A', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    unfollowButton: { padding: '8px 16px', fontSize: '14px', fontWeight: 600, color: '#4B4E6D', backgroundColor: 'white', border: '1px solid #E1DFDA', borderRadius: '8px', cursor: 'pointer' },
    deleteButton: { marginLeft: 'auto', background: 'none', border: '1px solid #E1DFDA', color: '#C73E3A', cursor: 'pointer', borderRadius: '4px', fontSize: '12px' },
    message: { textAlign: 'center' as const, color: '#A8A9AD', fontFamily: `'Noto Serif JP', serif` }
  };

  if (loading) return <p style={styles.message}>{t.loading ?? 'Loading profile...'}</p>;
  if (!profile) return <p style={{ ...styles.message, color: '#C73E3A' }}>{t.profileNotFound ?? 'Profile not found.'}</p>;
  if (error) return <p style={{ ...styles.message, color: '#C73E3A' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={styles.username}>{profile.username}</h1>
          {!isOwnProfile && (
            <button
              onClick={handleFollowToggle}
              style={profile.isFollowing ? styles.unfollowButton : styles.followButton}
            >
              {profile.isFollowing ? (t.unfollow ?? 'Unfollow') : (t.follow ?? 'Follow')}
            </button>
          )}
        </div>
        <div style={styles.stats}>
          <span onClick={() => setModalType('following')} style={styles.statItem}>
            <b>{profile.followingCount}</b> {t.followingTitle ?? 'Following'}
          </span>
          <span onClick={() => setModalType('followers')} style={styles.statItem}>
            <b>{profile.followerCount}</b> {t.followersTitle ?? 'Followers'}
          </span>
        </div>
      </div>
      <div>
        {profile.murmurs.map((murmur) => (
          <div key={murmur.id}>
            <MurmurCard murmur={murmur} onLikeToggle={handleLikeToggle} />
            {isOwnProfile && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-10px', marginBottom: '16px' }}>
                <button onClick={() => handleDeleteMurmur(murmur.id)} style={styles.deleteButton}>
                  {t.deleteButton ?? 'Delete'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {modalType && (
        <FollowListModal
          userId={profile.id}
          type={modalType}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
}
