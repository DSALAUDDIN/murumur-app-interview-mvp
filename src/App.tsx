import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import TimelinePage from './pages/TimelinePage'

function App() {
  const styles = {
    appContainer: {
      backgroundColor: '#EFE7DA',
      minHeight: '100vh',
    },
  };

  return (
      <div style={styles.appContainer}>
        <BrowserRouter>
          <Navbar />
          <main>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<ProtectedRoute><TimelinePage /></ProtectedRoute>} />

            </Routes>
          </main>
        </BrowserRouter>
      </div>
  );
}

export default App;
