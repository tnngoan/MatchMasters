import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faUsers, 
  faTrophy, 
  faChartLine, 
  faUserCircle, 
  faSignOutAlt, 
  faSignInAlt, 
  faUserPlus 
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Function to check if the link is active
  const isActive = (path) => {
    // Handle Dashboard link - active on homepage ('/')
    if (path === '/') {
      return location.pathname === '/';
    }
    
    // For other pages, check if pathname starts with the path 
    // (for nested routes like /profiles/1)
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <div className="brand-logo">
            <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="#5DFF00" strokeWidth="8" />
              <path d="M35 35L65 65" stroke="#5DFF00" strokeWidth="8" strokeLinecap="round" />
              <path d="M35 65L65 35" stroke="#5DFF00" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </div>
          MatchMasters
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {user && (
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/') ? 'active' : ''}`} to="/">
                  <FontAwesomeIcon icon={faHome} className="nav-icon" /> Dashboard
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/profiles') ? 'active' : ''}`} to="/profiles">
                <FontAwesomeIcon icon={faUsers} className="nav-icon" /> Officials
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/tournaments') ? 'active' : ''}`} to="/tournaments">
                <FontAwesomeIcon icon={faTrophy} className="nav-icon" /> Tournaments
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/live-scoring') ? 'active' : ''}`} to="/live-scoring">
                <FontAwesomeIcon icon={faChartLine} className="nav-icon" /> Live Scoring
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/profile') ? 'active' : ''}`} to="/profile">
                    <FontAwesomeIcon icon={faUserCircle} className="nav-icon" /> My Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button 
                    className="nav-link btn btn-link" 
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/login') ? 'active' : ''}`} to="/login">
                    <FontAwesomeIcon icon={faSignInAlt} className="nav-icon" /> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/register') ? 'active' : ''}`} to="/register">
                    <FontAwesomeIcon icon={faUserPlus} className="nav-icon" /> Register
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item language-toggle-container ms-2">
              <button 
                className="language-toggle-btn" 
                onClick={toggleLanguage}
                title={language === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang tiếng Anh'}
              >
                {language === 'en' ? 'VI' : 'EN'}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;