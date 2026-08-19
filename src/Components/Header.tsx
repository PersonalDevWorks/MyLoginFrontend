import {Link} from 'react-router-dom';
import './header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="logo">MyApp</div>

      <nav className="nav">
        <ul className="nav-list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </nav>
    </header>
  );
}