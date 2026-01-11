
import React from 'react';

interface WeatherCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ children, className = "", title }) => {
  return (
    <section className={`glass rounded-3xl p-6 transition-all duration-300 hover:bg-white/10 ${className}`}>
      {title && <h3 className="text-white/60 text-sm font-medium mb-4 uppercase tracking-wider">{title}</h3>}
      {children}
    </section>
  );
};

export default WeatherCard;
