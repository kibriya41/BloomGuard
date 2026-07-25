import React from 'react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating?: number;
}

export default function TestimonialCard({
  quote,
  author,
  role,
  avatar,
  rating = 5,
}: TestimonialCardProps) {
  return (
    <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex gap-1 text-amber-400 mb-4">
          {Array.from({ length: rating }).map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>
        <p className="text-gray-700 italic text-base leading-relaxed mb-6">
          "{quote}"
        </p>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <img
          src={avatar}
          alt={author}
          className="w-12 h-12 rounded-full object-cover border border-forest/20"
        />
        <div>
          <h4 className="font-bold text-gray-900 text-sm">{author}</h4>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}
