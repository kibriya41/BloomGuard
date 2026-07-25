import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

export default function FeatureCard({ icon, title, description, badge }: FeatureCardProps) {
  return (
    <div className="group relative p-8 rounded-2xl bg-white border border-gray-100 hover:border-forest/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {badge && (
        <span className="absolute top-6 right-6 px-3 py-1 text-xs font-semibold rounded-full bg-forest/10 text-forest">
          {badge}
        </span>
      )}
      <div>
        <div className="w-14 h-14 rounded-xl bg-sage-light flex items-center justify-center text-forest group-hover:bg-forest group-hover:text-white transition-colors duration-300 mb-6">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-forest transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
