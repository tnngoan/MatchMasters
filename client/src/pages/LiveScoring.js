import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, 
  faCalendarAlt, 
  faInfoCircle,
  faHistory,
  faLock,
  faClock,
  faChevronDown,
  faChevronUp,
  faSyncAlt
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './LiveScoring.css';

function LiveScoring() {
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minimized, setMinimized] = useState(true);
  const { user } = useAuth();
  const { language } = useLanguage();

  // Text content for different languages
  const content = {
    en: {
      pageTitle: 'Live Tournament Scoring',
      pageSubtitle: 'View real-time scores from the most recent tournament',
      loading: 'Loading scores...',
      error: 'Error loading scores',
      mostRecent: 'Most Recent Tournament',
      lastUpdated: 'Last Updated',
      tournament: 'Tournament',
      date: 'Date',
      category: 'Category',
      score: 'Score',
      loginForMore: 'Login for complete access',
      noScoresFound: 'No recent tournament scores available',
      viewMoreDetails: 'Login to view more details',
      expandAll: 'Expand All',
      collapseAll: 'Collapse All',
      refresh: 'Refresh Scores'
    },
    vi: {
      pageTitle: 'Bảng Điểm Trực Tiếp',
      pageSubtitle: 'Xem điểm số giải đấu gần đây nhất theo thời gian thực',
      loading: 'Đang tải điểm số...',
      error: 'Lỗi khi tải điểm số',
      mostRecent: 'Giải Đấu Gần Đây Nhất',
      lastUpdated: 'Cập Nhật Lần Cuối',
      tournament: 'Giải Đấu',
      date: 'Ngày',
      category: 'Hạng Mục',
      score: 'Điểm Số',
      loginForMore: 'Đăng nhập để truy cập đầy đủ',
      noScoresFound: 'Không có điểm số giải đấu gần đây',
      viewMoreDetails: 'Đăng nhập để xem thêm chi tiết',
      expandAll: 'Mở Rộng Tất Cả',
      collapseAll: 'Thu Gọn Tất Cả',
      refresh: 'Làm Mới Điểm Số'
    }
  };

  // Select the appropriate language content
  const t = content[language];

  useEffect(() => {
    const fetchLiveScores = async () => {
      try {
        // For demo purposes, we'll use mock data since we don't have a real-time scoring API yet
        // In a real application, you would call an API endpoint like:
        // const response = await axios.get('/api/scores/live');
        
        // Simulating API response with mock data
        const mockData = {
          tournament: {
            _id: "71d5ec9af682727af9612361",
            name: "Bay Area Basketball Tournament",
            sport: "Basketball",
            startDate: "2025-05-15T08:00:00.000Z",
            endDate: "2025-05-17T18:00:00.000Z",
            status: "in-progress",
            lastUpdated: new Date().toISOString()
          },
          scores: [
            { team1: "Golden Gate High Wildcats", team2: "Oakland Tech Bulldogs", score1: 78, score2: 72, status: "Final" },
            { team1: "Berkeley High Yellowjackets", team2: "San Francisco Prep Lions", score1: 65, score2: 63, status: "Final" },
            { team1: "Alameda Hornets", team2: "Richmond Oilers", score1: 54, score2: 58, status: "Final" },
            { team1: "San Jose Eagles", team2: "Daly City Panthers", score1: 82, score2: 75, status: "Final" }
          ]
        };
        
        setScoreData(mockData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching scores:', err);
        setError(`Failed to load scores: ${err.message}`);
        setLoading(false);
      }
    };

    fetchLiveScores();
  }, []);

  const refreshScores = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate updating scores with minor changes
      if (scoreData) {
        const updatedScores = scoreData.scores.map(match => ({
          ...match,
          lastUpdated: new Date().toISOString()
        }));
        
        setScoreData({
          ...scoreData,
          tournament: {
            ...scoreData.tournament,
            lastUpdated: new Date().toISOString()
          },
          scores: updatedScores
        });
      }
      setLoading(false);
    }, 1000);
  };

  const toggleMinimized = () => {
    setMinimized(!minimized);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'vi-VN', options);
  };

  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(language === 'en' ? 'en-US' : 'vi-VN', options);
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
    <div className="live-scoring-container container mt-5">
      <div className="live-scoring-header">
        <h1 className="live-scoring-title">{t.pageTitle}</h1>
        <p className="live-scoring-subtitle">{t.pageSubtitle}</p>
      </div>

      {!scoreData ? (
        <div className="empty-state">
          <FontAwesomeIcon icon={faTrophy} className="empty-icon" />
          <p>{t.noScoresFound}</p>
        </div>
      ) : (
        <div className="live-scoring-content">
          <div className="tournament-info-card">
            <div className="tournament-header">
              <h2 className="tournament-name">{scoreData.tournament.name}</h2>
              <div className="tournament-meta">
                <span className="tournament-sport">
                  <FontAwesomeIcon icon={faTrophy} className="me-2" />
                  {scoreData.tournament.sport}
                </span>
                <span className="tournament-date">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                  {formatDate(scoreData.tournament.startDate)}
                </span>
              </div>
            </div>
            <div className="controls-bar">
              <div className="last-updated">
                <FontAwesomeIcon icon={faClock} className="me-2" />
                {t.lastUpdated}: {formatDateTime(scoreData.tournament.lastUpdated)}
              </div>
              <div className="score-controls">
                <button className="control-btn refresh-btn" onClick={refreshScores}>
                  <FontAwesomeIcon icon={faSyncAlt} className="control-icon" />
                  <span className="control-text">{t.refresh}</span>
                </button>
                <button className="control-btn toggle-btn" onClick={toggleMinimized}>
                  <FontAwesomeIcon icon={minimized ? faChevronDown : faChevronUp} className="control-icon" />
                  <span className="control-text">{minimized ? t.expandAll : t.collapseAll}</span>
                </button>
              </div>
            </div>
          </div>

          <div className={`scores-list ${minimized ? 'minimized' : ''}`}>
            {scoreData.scores.map((match, index) => (
              <div className="score-card" key={index}>
                <div className="teams-container">
                  <div className={`team team-1 ${match.score1 > match.score2 ? 'winner' : ''}`}>
                    <h3>{minimized ? match.team1.split(' ').slice(-1)[0] : match.team1}</h3>
                    <div className="score">{match.score1}</div>
                  </div>
                  <div className="vs">VS</div>
                  <div className={`team team-2 ${match.score2 > match.score1 ? 'winner' : ''}`}>
                    <h3>{minimized ? match.team2.split(' ').slice(-1)[0] : match.team2}</h3>
                    <div className="score">{match.score2}</div>
                  </div>
                </div>
                {!minimized && <div className="match-status">{match.status}</div>}
              </div>
            ))}
          </div>

          <div className="login-prompt">
            <div className="lock-icon">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <p>{t.viewMoreDetails}</p>
            <Link to="/login" className="btn btn-primary">
              {t.loginForMore}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveScoring;