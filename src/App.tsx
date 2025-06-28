import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';


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
          <main>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

            </Routes>
          </main>
        </BrowserRouter>
      </div>
  );
}

export default App;
