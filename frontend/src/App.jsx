import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/NavbarNew';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Shows from './pages/Shows';
import MovieForm from './pages/MovieForm';
import MovieDetail from './pages/MovieDetail';
import AdminDashboard from './pages/AdminDashboardNew';
import Profile from './pages/ProfileNew';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/movies"
            element={
              <PrivateRoute>
                <Movies />
              </PrivateRoute>
            }
          />
          <Route
            path="/shows"
            element={
              <PrivateRoute>
                <Shows />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-movie"
            element={
              <PrivateRoute>
                <MovieForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-movie/:id"
            element={
              <PrivateRoute>
                <MovieForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/movies/:id"
            element={
              <PrivateRoute>
                <MovieDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                {user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
              </PrivateRoute>
            }
          />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
