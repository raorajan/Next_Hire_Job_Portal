import React from 'react';

const RadarChart = ({ data, size = 300 }) => {
  if (!data) return null;

  const padding = 40;
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - padding * 2) / 2;

  const categories = Object.keys(data);
  const totalAxes = categories.length;
  const angleStep = (Math.PI * 2) / totalAxes;

  // Generate points for the radar polygon based on data values (0-100)
  const getPoints = (values) => {
    return values.map((val, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const normalizedValue = Math.max(0, Math.min(100, val)) / 100;
      const r = radius * normalizedValue;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');
  };

  const dataValues = categories.map(cat => data[cat]);
  const polygonPoints = getPoints(dataValues);

  // Background grid levels
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <svg width={size} height={size} className="radar-chart">
      <defs>
        <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00C8FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8040FF" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Grid rings */}
      {levels.map((level, idx) => (
        <polygon
          key={idx}
          points={getPoints(Array(totalAxes).fill(level * 100))}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      ))}

      {/* Axes */}
      {categories.map((cat, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x2 = cx + radius * Math.cos(angle);
        const y2 = cy + radius * Math.sin(angle);

        // Label positioning
        const labelRadius = radius + 20;
        const labelX = cx + labelRadius * Math.cos(angle);
        const labelY = cy + labelRadius * Math.sin(angle);

        return (
          <g key={cat}>
            <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <text
              x={labelX}
              y={labelY}
              fill="#A0AEC0"
              fontSize="12"
              textAnchor="middle"
              alignmentBaseline="middle"
              className="capitalize"
            >
              {cat.replace(/([A-Z])/g, ' $1').trim()}
            </text>
          </g>
        );
      })}

      {/* Data Polygon */}
      <polygon
        points={polygonPoints}
        fill="url(#radarFill)"
        stroke="#00C8FF"
        strokeWidth="2"
        className="radar-data-polygon"
      />

      {/* Data Points */}
      {categories.map((cat, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const val = Math.max(0, Math.min(100, data[cat])) / 100;
        const pointX = cx + (radius * val) * Math.cos(angle);
        const pointY = cy + (radius * val) * Math.sin(angle);

        return (
          <circle
            key={`point-${cat}`}
            cx={pointX}
            cy={pointY}
            r="4"
            fill="#8040FF"
            stroke="#fff"
            strokeWidth="1"
            className="radar-point hover:r-6 cursor-pointer transition-all duration-300"
          >
            <title>{`${cat}: ${data[cat]}%`}</title>
          </circle>
        );
      })}
    </svg>
  );
};

export default RadarChart;
