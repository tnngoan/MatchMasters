import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, 
  faMapMarkerAlt, 
  faCalendarAlt, 
  faInfoCircle,
  faUserClock,
  faMoneyBillWave,
  faTags
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Tournaments.css';

function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { language } = useLanguage();

  // Text content for different languages
  const content = {
    en: {
      pageTitle: 'Upcoming Tournaments',
      pageSubtitle: 'Discover exciting sports events happening around you',
      loading: 'Loading tournaments...',
      error: 'Error loading tournaments',
      viewDetails: 'View Details',
      registerInterest: 'Register Interest',
      login: 'Login to Apply',
      date: 'Date',
      location: 'Location',
      sportType: 'Sport',
      requiredOfficials: 'Officials Needed',
      compensation: 'Compensation',
      categories: 'Categories',
      registrationDeadline: 'Registration Deadline',
      noTournamentsFound: 'No upcoming tournaments found'
    },
    vi: {
      pageTitle: 'Giải Đấu Sắp Tới',
      pageSubtitle: 'Khám phá các sự kiện thể thao thú vị đang diễn ra xung quanh bạn',
      loading: 'Đang tải giải đấu...',
      error: 'Lỗi khi tải giải đấu',
      viewDetails: 'Xem Chi Tiết',
      registerInterest: 'Đăng Ký Quan Tâm',
      login: 'Đăng Nhập để Ứng Tuyển',
      date: 'Ngày',
      location: 'Địa Điểm',
      sportType: 'Môn Thể Thao',
      requiredOfficials: 'Trọng Tài Cần Thiết',
      compensation: 'Thù Lao',
      categories: 'Hạng Mục',
      registrationDeadline: 'Hạn Chót Đăng Ký',
      noTournamentsFound: 'Không tìm thấy giải đấu sắp tới nào'
    }
  };

  // Select the appropriate language content
  const t = content[language];

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        // Use sample data for unauthorized users since the /api/home endpoint is restricted
        // This could later be replaced with a public tournaments endpoint
        if (!user) {
          // Sample data for unauthorized users
          const sampleTournaments = [
            {
              "_id": "71d5ec9af682727af9612361",
              "name": "Bay Area Basketball Tournament",
              "location": {
                "venue": "Oakland Sports Complex",
                "address": "123 Main Street, Oakland, CA 94612",
                "city": "Oakland",
                "state": "CA"
              },
              "startDate": "2025-05-15T08:00:00.000Z",
              "endDate": "2025-05-17T18:00:00.000Z",
              "sport": "Basketball",
              "description": "Annual high school basketball tournament featuring teams from across the Bay Area. Three days of competitive play with divisions for boys and girls varsity teams.",
              "status": "upcoming",
              "requiredJudges": 5,
              "judgeCompensation": 80,
              "categories": ["Boys Varsity", "Girls Varsity"],
              "registrationDeadline": "2025-05-01T23:59:59.000Z"
            },
            {
              "_id": "71d5ec9af682727af9612362",
              "name": "West Coast Swimming Championships",
              "location": {
                "venue": "Pacific Aquatic Center",
                "address": "456 Beach Blvd, San Diego, CA 92109",
                "city": "San Diego",
                "state": "CA"
              },
              "startDate": "2025-06-05T09:00:00.000Z",
              "endDate": "2025-06-08T17:00:00.000Z",
              "sport": "Swimming",
              "description": "Olympic-qualifying swimming meet with events for all age groups and abilities. Features 50m and 25m races in all strokes plus relays and medleys.",
              "status": "upcoming",
              "requiredJudges": 8,
              "judgeCompensation": 70,
              "categories": ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "Individual Medley", "Relays"],
              "registrationDeadline": "2025-05-25T23:59:59.000Z"
            },
            {
              "_id": "71d5ec9af682727af9612364",
              "name": "Pacific Coast Tennis Open",
              "location": {
                "venue": "Oceanside Tennis Club",
                "address": "321 Racquet Drive, Santa Barbara, CA 93101",
                "city": "Santa Barbara",
                "state": "CA"
              },
              "startDate": "2025-05-25T09:00:00.000Z",
              "endDate": "2025-05-31T18:00:00.000Z",
              "sport": "Tennis",
              "description": "Premier tennis tournament featuring singles and doubles competitions across multiple divisions. Open to amateur and semi-professional players.",
              "status": "upcoming",
              "requiredJudges": 12,
              "judgeCompensation": 90,
              "categories": ["Men's Singles", "Women's Singles", "Men's Doubles", "Women's Doubles", "Mixed Doubles"],
              "registrationDeadline": "2025-05-15T23:59:59.000Z"
            }
          ];
          setTournaments(sampleTournaments);
          setLoading(false);
          return;
        }

        // For authenticated users, fetch from the home endpoint
        const response = await axios.get('/api/home');
        if (response.data && response.data.events) {
          // Filter for upcoming events only
          const upcomingEvents = response.data.events.filter(event => 
            event.status === 'upcoming'
          );
          setTournaments(upcomingEvents);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching tournaments:', err);
        setError(`Failed to load tournaments: ${err.message}${err.response ? ` (Status: ${err.response.status})` : ''}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [user]);

  // Format the date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'vi-VN', options);
  };

  // Format the date range
  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // If it's a multi-day event
    if (start.toDateString() !== end.toDateString()) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    
    // If it's a single day event
    return formatDate(startDate);
  };

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
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
          <h3>{t.error}</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tournaments-container container mt-5">
      <div className="tournaments-header">
        <h1 className="tournaments-title">{t.pageTitle}</h1>
        <p className="tournaments-subtitle">{t.pageSubtitle}</p>
      </div>

      {tournaments.length === 0 ? (
        <div className="empty-state">
          <FontAwesomeIcon icon={faTrophy} className="empty-icon" />
          <p>{t.noTournamentsFound}</p>
        </div>
      ) : (
        <div className="tournaments-list">
          {tournaments.map((tournament) => (
            <div className="tournament-card" key={tournament._id}>
              <div className="tournament-header">
                <div className="tournament-title-section">
                  <h2 className="tournament-name">{tournament.name || tournament.title}</h2>
                  {tournament.sport && (
                    <span className="tournament-sport">
                      <FontAwesomeIcon icon={faTags} />
                      {tournament.sport}
                    </span>
                  )}
                </div>
                <div className="tournament-status">
                  <span className="status-badge status-upcoming">
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                    {tournament.status}
                  </span>
                </div>
              </div>

              <div className="tournament-body">
                <div className="tournament-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faCalendarAlt} className="detail-icon" />
                      <div className="detail-content">
                        <h4>{t.date}</h4>
                        <p>{formatDateRange(tournament.startDate, tournament.endDate)}</p>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="detail-icon" />
                      <div className="detail-content">
                        <h4>{t.location}</h4>
                        <p>
                          {tournament.location && (
                            <>
                              {tournament.location.venue}
                              {tournament.location.city && `, ${tournament.location.city}`}
                              {tournament.location.state && `, ${tournament.location.state}`}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="detail-row">
                    {tournament.requiredJudges && (
                      <div className="detail-item">
                        <FontAwesomeIcon icon={faUserClock} className="detail-icon" />
                        <div className="detail-content">
                          <h4>{t.requiredOfficials}</h4>
                          <p>{tournament.requiredJudges}</p>
                        </div>
                      </div>
                    )}
                    
                    {tournament.judgeCompensation && (
                      <div className="detail-item">
                        <FontAwesomeIcon icon={faMoneyBillWave} className="detail-icon" />
                        <div className="detail-content">
                          <h4>{t.compensation}</h4>
                          <p className="compensation">${tournament.judgeCompensation}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {tournament.description && (
                    <div className="tournament-description">
                      <p>{tournament.description}</p>
                    </div>
                  )}

                  {tournament.categories && (
                    <div className="tournament-categories">
                      <h4>{t.categories}</h4>
                      <div className="categories-tags">
                        {tournament.categories.map((category, idx) => (
                          <span key={idx} className="category-tag">{category}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {tournament.registrationDeadline && (
                    <div className="registration-deadline">
                      <strong>{t.registrationDeadline}:</strong> {formatDate(tournament.registrationDeadline)}
                    </div>
                  )}
                </div>
              </div>

              <div className="tournament-footer">
                {user ? (
                  <Link to={`/tournaments/${tournament._id}`} className="btn btn-primary view-details-btn">
                    <FontAwesomeIcon icon={faInfoCircle} className="btn-icon" />
                    {t.viewDetails}
                  </Link>
                ) : (
                  <Link to="/login" className="btn btn-primary view-details-btn">
                    <FontAwesomeIcon icon={faInfoCircle} className="btn-icon" />
                    {t.login}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tournaments;