import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import { AgentStats } from '../types';

interface AgentRadarProps {
  stats: AgentStats;
  color?: string;
}

export const AgentRadar: React.FC<AgentRadarProps> = ({ stats, color = "#8884d8" }) => {
  const data = [
    { subject: 'Philosophy', A: stats.philosophy, fullMark: 100 },
    { subject: 'Art', A: stats.art, fullMark: 100 },
    { subject: 'Science', A: stats.science, fullMark: 100 },
    { subject: 'Ethics', A: stats.ethics, fullMark: 100 },
  ];

  return (
    <div className="w-full h-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#3f3f46" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#a1a1aa', fontSize: 12, fontFamily: 'JetBrains Mono' }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Agent Stats"
            dataKey="A"
            stroke={color}
            strokeWidth={2}
            fill={color}
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};