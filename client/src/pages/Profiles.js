import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Profiles.css';

function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguage();
  const { user } = useAuth();

  // Text content for different languages
  const content = {
    en: {
      pageTitle: 'Sport Officials',
      pageSubtitle: 'Connect with experienced judges and officials for your events',
      loading: 'Loading officials profiles...',
      error: 'Error loading profiles',
      viewProfile: 'View Profile',
      sports: 'Sports',
      experience: 'Experience',
      hourlyRate: 'Hourly Rate',
      years: 'years',
      noProfilesFound: 'No official profiles found',
      filterByTag: 'Filter by sport'
    },
    vi: {
      pageTitle: 'Trọng Tài Thể Thao',
      pageSubtitle: 'Kết nối với các trọng tài và quan chức có kinh nghiệm cho sự kiện của bạn',
      loading: 'Đang tải hồ sơ trọng tài...',
      error: 'Lỗi khi tải hồ sơ',
      viewProfile: 'Xem Hồ Sơ',
      sports: 'Môn Thể Thao',
      experience: 'Kinh Nghiệm',
      hourlyRate: 'Giá Theo Giờ',
      years: 'năm',
      noProfilesFound: 'Không tìm thấy hồ sơ trọng tài nào',
      filterByTag: 'Lọc theo môn thể thao'
    }
  };

  const t = content[language];

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        console.log('Fetching profiles data...');
        const response = await axios.get('/api/profiles');
        console.log('Profiles data received:', response.data);
        setProfiles(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError(`Failed to load profiles: ${err.message}${err.response ? ` (Status: ${err.response.status})` : ''}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center loading-container">
        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
        <p className="mt-3">{t.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="error-container">
          <div className="icon-container">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h3>{t.error}</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profiles-container container mt-5">
      <div className="profiles-header">
        <h1 className="profiles-title">{t.pageTitle}</h1>
        <p className="profiles-subtitle">{t.pageSubtitle}</p>
        
        {/* Admin-only seed data button */}
        {user && user.role === 'admin' && (
          <div className="admin-actions mt-4">
            <button 
              className="btn btn-secondary mb-4" 
              onClick={async () => {
                try {
                  setLoading(true);
                  const response = await axios.post('/api/seed/profiles/pickleball');
                  alert('Profiles seeded successfully!');
                  window.location.reload();
                } catch (err) {
                  console.error('Error seeding profiles:', err);
                  alert(`Failed to seed profiles: ${err.message}`);
                } finally {
                  setLoading(false);
                }
              }}
            >
              <i className="fas fa-database me-2"></i> Seed Profiles Data
            </button>
          </div>
        )}
      </div>

      {profiles.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-users-slash"></i>
          <p>{t.noProfilesFound}</p>
        </div>
      ) : (
        <div className="row">
          {profiles.map((profile) => (
            <div className="col-lg-4 col-md-6 mb-4" key={profile._id}>
              <div className="profile-card">
                <div className="profile-header">
                  <div className="profile-avatar">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={profile.name} className="profile-img" />
                    ) : (
                      <div className="default-avatar">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                  </div>
                  <h3 className="profile-name">{profile.name}</h3>
                  {profile.title && <p className="profile-title">{profile.title}</p>}
                </div>
                
                <div className="profile-body">
                  {profile.sports && profile.sports.length > 0 && (
                    <div className="profile-item">
                      <h4><i className="fas fa-basketball-ball"></i> {t.sports}</h4>
                      <div className="sports-tags">
                        {profile.sports.map((sport, idx) => (
                          <span key={idx} className="sport-tag">{sport}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {profile.experience && (
                    <div className="profile-item">
                      <h4><i className="fas fa-award"></i> {t.experience}</h4>
                      <p>{profile.experience} {t.years}</p>
                    </div>
                  )}
                  
                  {(profile.hourlyRate || profile.ratePerHour) && (
                    <div className="profile-item">
                      <h4><i className="fas fa-dollar-sign"></i> {t.hourlyRate}</h4>
                      <p className="rate">${profile.hourlyRate || profile.ratePerHour}/hr</p>
                    </div>
                  )}
                </div>
                
                <div className="profile-footer">
                  <button className="btn btn-primary view-profile-btn">
                    <i className="fas fa-user-circle"></i> {t.viewProfile}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profiles;