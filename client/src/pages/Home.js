import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  // Text content for different languages
  const content = {
    en: {
      heroTitle: 'Welcome to MatchMasters',
      heroSubtitle: 'Connecting elite judges with competitive sports events',
      heroDescription: 'MatchMasters is the premier platform for tournament organizers to find qualified officials and for sports judges to discover exciting opportunities across various sports.',
      getStarted: 'Get Started',
      signIn: 'Sign In',
      whyChoose: 'Why Choose MatchMasters?',
      eliteOfficials: 'Elite Officials',
      eliteOfficialsDesc: 'Access a network of vetted, experienced judges across multiple sports disciplines',
      seamlessScheduling: 'Seamless Scheduling',
      seamlessSchedulingDesc: 'Easily manage event bookings, confirmations, and payments all in one place',
      qualityAssurance: 'Quality Assurance',
      qualityAssuranceDesc: 'Maintain high standards with our comprehensive rating and review system',
      sportsCover: 'Sports We Cover',
      tableTennis: 'Table Tennis',
      basketball: 'Basketball',
      volleyball: 'Volleyball',
      soccer: 'Soccer',
      pickleball: 'Pickleball',
      tennis: 'Tennis',
      readyToElevate: 'Ready to Elevate Your Sports Events?',
      joinThousands: 'Join thousands of organizers and officials who trust MatchMasters',
      joinToday: 'Join MatchMasters Today',
      goToProfile: 'Go to My Profile',
      // Admin dashboard texts
      adminDashboard: 'MatchMasters Admin Dashboard',
      manageUsers: 'Manage users, profiles, events, and bookings from this central dashboard.',
      loggedInAs: 'You are logged in as admin',
      users: 'Users',
      profiles: 'Profiles',
      events: 'Events',
      bookings: 'Bookings',
      noUsersFound: 'No users found.',
      noProfilesFound: 'No profiles found.',
      noEventsFound: 'No events found.',
      noBookingsFound: 'No bookings found.',
      dataUpdated: 'Data last updated:',
      loading: 'Loading data...',
      error: 'Error'
    },
    vi: {
      heroTitle: 'Chào mừng đến với MatchMasters',
      heroSubtitle: 'Kết nối trọng tài hàng đầu với các sự kiện thể thao cạnh tranh',
      heroDescription: 'MatchMasters là nền tảng hàng đầu giúp ban tổ chức giải đấu tìm các trọng tài có trình độ và giúp trọng tài thể thao khám phá những cơ hội thú vị trong nhiều môn thể thao khác nhau.',
      getStarted: 'Bắt đầu',
      signIn: 'Đăng nhập',
      whyChoose: 'Tại sao chọn MatchMasters?',
      eliteOfficials: 'Trọng tài Hàng đầu',
      eliteOfficialsDesc: 'Tiếp cận mạng lưới trọng tài có kinh nghiệm, được thẩm định trong nhiều bộ môn thể thao',
      seamlessScheduling: 'Lịch trình Suôn sẻ',
      seamlessSchedulingDesc: 'Dễ dàng quản lý đặt lịch sự kiện, xác nhận và thanh toán tại một nơi',
      qualityAssurance: 'Đảm bảo Chất lượng',
      qualityAssuranceDesc: 'Duy trì tiêu chuẩn cao với hệ thống xếp hạng và đánh giá toàn diện của chúng tôi',
      sportsCover: 'Các môn thể thao chúng tôi phục vụ',
      tableTennis: 'Bóng bàn',
      basketball: 'Bóng rổ',
      volleyball: 'Bóng chuyền',
      soccer: 'Bóng đá',
      pickleball: 'Pickleball',
      tennis: 'Quần vợt',
      readyToElevate: 'Sẵn sàng nâng tầm Sự kiện Thể thao của bạn?',
      joinThousands: 'Tham gia cùng hàng ngàn ban tổ chức và trọng tài tin dùng MatchMasters',
      joinToday: 'Tham gia MatchMasters ngay hôm nay',
      goToProfile: 'Đi đến Hồ sơ của tôi',
      // Admin dashboard texts
      adminDashboard: 'Bảng điều khiển Admin MatchMasters',
      manageUsers: 'Quản lý người dùng, hồ sơ, sự kiện và đặt lịch từ bảng điều khiển trung tâm.',
      loggedInAs: 'Bạn đang đăng nhập với tư cách quản trị viên',
      users: 'Người dùng',
      profiles: 'Hồ sơ',
      events: 'Sự kiện',
      bookings: 'Đặt lịch',
      noUsersFound: 'Không tìm thấy người dùng nào.',
      noProfilesFound: 'Không tìm thấy hồ sơ nào.',
      noEventsFound: 'Không tìm thấy sự kiện nào.',
      noBookingsFound: 'Không tìm thấy đặt lịch nào.',
      dataUpdated: 'Dữ liệu cập nhật lần cuối:',
      loading: 'Đang tải dữ liệu...',
      error: 'Lỗi'
    }
  };

  // Get current language content
  const t = content[language];

  // Check if user is authorized for admin dashboard
  const isAdmin = user && user.email === 'ngoan.n.tr@gmail.com';

  useEffect(() => {
    // Only fetch admin data if the user is authorized
    if (isAdmin) {
      const fetchHomeData = async () => {
        try {
          setLoading(true);
          const response = await axios.get('/api/home');
          setHomeData(response.data);
          setError(null);
        } catch (err) {
          console.error('Error fetching home data:', err);
          setError('Failed to load data. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchHomeData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  // Public homepage with introduction about MatchMasters
  if (!isAdmin) {
    return (
      <div className="homepage-container">
        <div className="hero-section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h1 className="hero-title">{t.heroTitle}</h1>
                <p className="hero-subtitle">{t.heroSubtitle}</p>
                <p className="hero-description">{t.heroDescription}</p>
                {!user && (
                  <div className="hero-buttons">
                    <Link to="/register" className="btn btn-primary me-3">{t.getStarted}</Link>
                    <Link to="/login" className="btn btn-outline-light">{t.signIn}</Link>
                  </div>
                )}
              </div>
              <div className="col-lg-6">
                <div className="hero-image-container">
                  <img 
                    src="https://img.freepik.com/free-vector/flat-design-sport-elements-collection_23-2148843874.jpg" 
                    alt="Sports Officials and Events" 
                    className="hero-image" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="features-section">
          <div className="container">
            <h2 className="section-title text-center">{t.whyChoose}</h2>
            <div className="row mt-5">
              <div className="col-md-4">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="fas fa-trophy"></i>
                  </div>
                  <h3 className="feature-title">{t.eliteOfficials}</h3>
                  <p className="feature-text">{t.eliteOfficialsDesc}</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <h3 className="feature-title">{t.seamlessScheduling}</h3>
                  <p className="feature-text">{t.seamlessSchedulingDesc}</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="fas fa-star"></i>
                  </div>
                  <h3 className="feature-title">{t.qualityAssurance}</h3>
                  <p className="feature-text">{t.qualityAssuranceDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sports-section">
          <div className="container">
            <h2 className="section-title text-center">{t.sportsCover}</h2>
            <div className="sports-grid">
              <div className="sport-item">
                <i className="fas fa-table-tennis"></i>
                <span>{t.tableTennis}</span>
              </div>
              <div className="sport-item">
                <i className="fas fa-basketball-ball"></i>
                <span>{t.basketball}</span>
              </div>
              <div className="sport-item">
                <i className="fas fa-volleyball-ball"></i>
                <span>{t.volleyball}</span>
              </div>
              <div className="sport-item">
                <i className="fas fa-futbol"></i>
                <span>{t.soccer}</span>
              </div>
              <div className="sport-item">
                <i className="fas fa-table-tennis"></i>
                <span>{t.pickleball}</span>
              </div>
              <div className="sport-item">
                <i className="fas fa-tennis-ball"></i>
                <span>{t.tennis}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <div className="container text-center">
            <h2 className="cta-title">{t.readyToElevate}</h2>
            <p className="cta-text">{t.joinThousands}</p>
            {!user ? (
              <Link to="/register" className="btn btn-primary btn-lg">{t.joinToday}</Link>
            ) : (
              <Link to="/profile" className="btn btn-primary btn-lg">{t.goToProfile}</Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard section - only shown to admin user
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

  const renderTabContent = () => {
    if (!homeData) return null;

    switch (activeTab) {
      case 'users':
        return (
          <div className="data-container">
            <div className="data-header">
              <h3><i className="fas fa-users tab-icon"></i> {t.users} <span className="badge count-badge">{homeData.users ? homeData.users.length : 0}</span></h3>
            </div>
            {homeData.users && homeData.users.length > 0 ? (
              <div className="table-responsive custom-table-container">
                <table className="table table-striped table-hover custom-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {homeData.users.map(user => (
                      <tr key={user._id}>
                        <td><span className="id-text">{user._id}</span></td>
                        <td>{user.email}</td>
                        <td><span className="badge role-badge">{user.role}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <i className="fas fa-users-slash"></i>
                <p>{t.noUsersFound}</p>
              </div>
            )}
          </div>
        );
      case 'profiles':
        return (
          <div className="data-container">
            <div className="data-header">
              <h3><i className="fas fa-id-card tab-icon"></i> {t.profiles} <span className="badge count-badge">{homeData.profiles ? homeData.profiles.length : 0}</span></h3>
            </div>
            {homeData.profiles && homeData.profiles.length > 0 ? (
              <div className="table-responsive custom-table-container">
                <table className="table table-striped table-hover custom-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Sports</th>
                      <th>Experience</th>
                      <th>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {homeData.profiles.map(profile => (
                      <tr key={profile._id}>
                        <td><span className="id-text">{profile._id}</span></td>
                        <td>{profile.name || 'N/A'}</td>
                        <td>
                          <div className="sports-tags">
                            {profile.sports ? 
                              profile.sports.map((sport, idx) => (
                                <span key={idx} className="sport-tag">{sport}</span>
                              )) 
                              : 'N/A'}
                          </div>
                        </td>
                        <td>{profile.experience || 'N/A'}</td>
                        <td><span className="rate-badge">${profile.hourlyRate || profile.ratePerHour || 'N/A'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <i className="fas fa-id-card-alt"></i>
                <p>{t.noProfilesFound}</p>
              </div>
            )}
          </div>
        );
      case 'events':
        return (
          <div className="data-container">
            <div className="data-header">
              <h3><i className="fas fa-calendar-check tab-icon"></i> {t.events} <span className="badge count-badge">{homeData.events ? homeData.events.length : 0}</span></h3>
            </div>
            {homeData.events && homeData.events.length > 0 ? (
              <div className="table-responsive custom-table-container">
                <table className="table table-striped table-hover custom-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name/Title</th>
                      <th>Location</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {homeData.events.map(event => (
                      <tr key={event._id}>
                        <td><span className="id-text">{event._id}</span></td>
                        <td className="event-name">{event.name || event.title}</td>
                        <td>
                          <div className="location-info">
                            {event.location && (event.location.venue || event.location.city) 
                              ? (<><i className="fas fa-map-marker-alt location-icon"></i> {event.location.venue || ''} {event.location.city || ''}</>) 
                              : 'N/A'}
                          </div>
                        </td>
                        <td>{new Date(event.startDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge ${event.status === 'upcoming' ? 'status-upcoming' : 'status-past'}`}>
                            <i className={`fas fa-${event.status === 'upcoming' ? 'calendar-day' : 'calendar-check'} me-1`}></i>
                            {event.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <i className="fas fa-calendar-times"></i>
                <p>{t.noEventsFound}</p>
              </div>
            )}
          </div>
        );
      case 'bookings':
        return (
          <div className="data-container">
            <div className="data-header">
              <h3><i className="fas fa-handshake tab-icon"></i> {t.bookings} <span className="badge count-badge">{homeData.bookings ? homeData.bookings.length : 0}</span></h3>
            </div>
            {homeData.bookings && homeData.bookings.length > 0 ? (
              <div className="table-responsive custom-table-container">
                <table className="table table-striped table-hover custom-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Judge ID</th>
                      <th>Event ID</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Compensation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {homeData.bookings.map(booking => (
                      <tr key={booking._id}>
                        <td><span className="id-text">{booking._id}</span></td>
                        <td>{booking.judgeId}</td>
                        <td>{booking.eventId}</td>
                        <td><span className="role-type">{booking.role}</span></td>
                        <td>
                          <span className={`status-badge ${booking.status === 'confirmed' ? 'status-confirmed' : 'status-pending'}`}>
                            <i className={`fas fa-${booking.status === 'confirmed' ? 'check-circle' : 'clock'} me-1`}></i>
                            {booking.status}
                          </span>
                        </td>
                        <td><span className="compensation">${booking.compensation}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <i className="fas fa-calendar-times"></i>
                <p>{t.noBookingsFound}</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-5 home-container">
      <div className="welcome-section">
        <div className="welcome-header">
          <h1>{t.adminDashboard}</h1>
          <div className="welcome-icon">
            <div className="admin-dashboard-icon">
              <i className="fas fa-chart-line"></i>
              <i className="fas fa-users"></i>
              <i className="fas fa-cogs"></i>
            </div>
          </div>
        </div>
        <p className="lead">
          {t.manageUsers}
        </p>
        <div className="user-info">
          <p><i className="fas fa-user-check"></i> {t.loggedInAs} <span className="user-email">{user.name || user.email}</span></p>
        </div>
      </div>

      <div className="data-card">
        <div className="tabs-container">
          <ul className="nav custom-tabs">
            <li className="nav-item">
              <button 
                className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <i className="fas fa-users tab-icon"></i> {t.users}
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`tab-button ${activeTab === 'profiles' ? 'active' : ''}`}
                onClick={() => setActiveTab('profiles')}
              >
                <i className="fas fa-id-card tab-icon"></i> {t.profiles}
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => setActiveTab('events')}
              >
                <i className="fas fa-calendar-check tab-icon"></i> {t.events}
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                <i className="fas fa-handshake tab-icon"></i> {t.bookings}
              </button>
            </li>
          </ul>
        </div>
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>

      <div className="footer-info">
        <p className="text-muted">
          <i className="fas fa-sync-alt"></i> {t.dataUpdated} {homeData ? new Date(homeData.timestamp).toLocaleString() : ''}
        </p>
      </div>
    </div>
  );
}

export default Home;