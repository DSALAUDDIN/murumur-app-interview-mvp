import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TimelinePage from './pages/TimelinePage';
import ProfilePage from './pages/ProfilePage';
import DiscoverPage from './pages/DiscoverPage';
import SearchPage from './pages/SearchPage';
import MurmurDetailPage from './pages/MurmurDetailPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  const styles = {
    appContainer: {
      backgroundColor: '#EFE7DA',
      minHeight: '100vh',
    },
  };

  return (
    <LanguageProvider>
      <div style={styles.appContainer}>
        <BrowserRouter>
          <Navbar />
          <main>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<ProtectedRoute><TimelinePage /></ProtectedRoute>} />
              <Route path="/profile/:userId" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/discover" element={<ProtectedRoute><DiscoverPage /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
              <Route path="/murmur/:murmurId" element={<ProtectedRoute><MurmurDetailPage /></ProtectedRoute>} />
            </Routes>
          </main>
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
