import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapMarkerAlt, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center footer-content">
          <div className="footer-info">
            <div className="contact-links">
              <a href="mailto:ngoan.n.tr@gmail.com" className="footer-link">
                <FontAwesomeIcon icon={faEnvelope} className="icon" /> ngoan.n.tr@gmail.com
              </a>
              <a href="https://github.com/tnngoan" target="_blank" rel="noopener noreferrer" className="footer-link">
                <FontAwesomeIcon icon={faGithub} className="icon" /> github.com/tnngoan
              </a>
            </div>
          </div>
          <div className="location-info">
            <div className="made-with-love mb-2">
              <FontAwesomeIcon icon={faHeart} className="icon heart-icon" /> Made with love
            </div>
            <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" /> In service for Ho Chi Minh City, Vietnam
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;