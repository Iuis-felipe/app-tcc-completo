"use client";

import React from 'react';
import CountUp from 'react-countup';

interface KpiCardProps {
  title: string;
  value: number;
  description?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, description }) => {
  return (
    <div className="bg-[#222222] border border-[#525252] p-6 rounded-lg shadow-lg">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
        {title}
      </h3>
      <div className="mt-2">
        <p className="text-3xl font-bold text-gray-100">
          <CountUp end={value} duration={2.5} separator="." /> 
        </p>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
    </div>
  );
};

export default KpiCard;