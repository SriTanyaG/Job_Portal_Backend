import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logout, isEmployer } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">💼</span>
          <span className="logo-text">JobPortal</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Jobs
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="navbar-link">
                Dashboard
              </Link>
              {isEmployer() && (
                <Link to="/dashboard?action=post-job" className="navbar-link">
                  Post Job
                </Link>
              )}
              <div className="navbar-user">
                <span className="user-email">{user.email}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

