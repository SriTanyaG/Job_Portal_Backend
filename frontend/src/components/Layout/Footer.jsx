import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">JobPortal</h3>
            <p className="footer-description">
              Connecting talented individuals with amazing opportunities. 
              Your next career move starts here.
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">For Job Seekers</h4>
            <ul className="footer-links">
              <li><a href="/">Browse Jobs</a></li>
              <li><a href="/register">Create Account</a></li>
              <li><a href="/dashboard">My Applications</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">For Employers</h4>
            <ul className="footer-links">
              <li><a href="/register?role=employer">Post a Job</a></li>
              <li><a href="/dashboard">Manage Jobs</a></li>
              <li><a href="/">Find Talent</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

