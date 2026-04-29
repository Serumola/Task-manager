import './SkeletonLoader.css';

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="skeleton-card">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-content">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={`skeleton-line ${i === lines - 1 ? 'short' : ''}`}></div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="skeleton-stat">
      <div className="skeleton-stat-header">
        <div className="skeleton-icon"></div>
        <div className="skeleton-label"></div>
      </div>
      <div className="skeleton-stat-number"></div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="skeleton-chart">
      <div className="skeleton-chart-header">
        <div className="skeleton-chart-title"></div>
        <div className="skeleton-chart-icon"></div>
      </div>
      <div className="skeleton-chart-content">
        <div className="skeleton-bars">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="skeleton-bar-item">
              <div className="skeleton-bar" style={{ height: `${Math.random() * 60 + 40}%` }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonTaskItem() {
  return (
    <div className="skeleton-task-item">
      <div className="skeleton-checkbox"></div>
      <div className="skeleton-task-name"></div>
      <div className="skeleton-task-action"></div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="skeleton-dashboard">
      <div className="skeleton-header">
        <div className="skeleton-page-title"></div>
        <div className="skeleton-date-box"></div>
      </div>
      <div className="skeleton-stats-row">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonStat key={i} />
        ))}
      </div>
      <div className="skeleton-charts-grid">
        <SkeletonChart />
        <SkeletonChart />
        <div className="skeleton-chart skeleton-chart-small">
          <div className="skeleton-chart-header">
            <div className="skeleton-chart-title"></div>
          </div>
          <div className="skeleton-chart-content">
            <div className="skeleton-quick-stats">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton-quick-stat">
                  <div className="skeleton-quick-stat-icon"></div>
                  <div className="skeleton-quick-stat-info">
                    <div className="skeleton-quick-stat-label"></div>
                    <div className="skeleton-quick-stat-value"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="skeleton-add-task">
        <div className="skeleton-section-header"></div>
        <div className="skeleton-input-row">
          <div className="skeleton-input"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>
      <div className="skeleton-task-list">
        <div className="skeleton-section-title"></div>
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonTaskItem key={i} />
        ))}
      </div>
    </div>
  );
}

export default SkeletonCard;
