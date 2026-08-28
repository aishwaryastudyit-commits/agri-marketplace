import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = 'rgba(22, 163, 74, 0.12)',
  iconColor = '#15803d',
  trend = null,
  trendType = 'up',
  onClick = null
}) {
  return (
    <div
      className="stat-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="stat-card-top">
        <span className="stat-card-title">{title}</span>
        {Icon && (
          <div
            className="stat-icon-badge"
            style={{ backgroundColor: iconBg, color: iconColor }}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      <div className="stat-card-value">{value}</div>

      <div className="stat-card-footer">
        {trend && (
          <span className={`stat-trend-badge ${trendType === 'up' ? 'stat-trend-up' : 'stat-trend-neutral'}`}>
            <ArrowUpRight size={12} />
            {trend}
          </span>
        )}
        <span>{subtitle || 'Updated in real-time'}</span>
      </div>
    </div>
  );
}
