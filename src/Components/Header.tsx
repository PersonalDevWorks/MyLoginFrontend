import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './header.css';

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login'); // Navigate to the login page after logout
  }

  return (
    <header className="header">
      <div className="logo">MyApp</div>

      <nav className="nav">
        <ul className="nav-list">
          {
            isLoggedIn ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )
          }

        </ul>
      </nav>
    </header>
  );
}