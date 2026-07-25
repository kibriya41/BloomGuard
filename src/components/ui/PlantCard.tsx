import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Droplets, Sun, ArrowUpRight } from 'lucide-react';

export interface PlantCardProps {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  category: string;
  waterNeed: string;
  lightNeed: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
}

export default function PlantCard({
  id,
  name,
  scientificName,
  image,
  category,
  waterNeed,
  lightNeed,
  difficulty,
}: PlantCardProps) {
  const difficultyColors = {
    Easy: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Moderate: 'bg-amber-100 text-amber-800 border-amber-200',
    Advanced: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  return (
    <div className="group rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Header */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/90 backdrop-blur-md text-gray-800 shadow-sm">
            {category}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border shadow-sm ${difficultyColors[difficulty]}`}
          >
            {difficulty}
          </span>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-forest transition-colors">
            {name}
          </h3>
          <p className="text-xs italic text-gray-500 mb-4">{scientificName}</p>

          <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-100 mb-4 text-xs font-medium text-gray-600">
            <div className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span>{waterNeed}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>{lightNeed}</span>
            </div>
          </div>
        </div>

        <Link
          href={`/plants/${id}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sage-light hover:bg-forest hover:text-white text-forest text-sm font-semibold transition-all duration-200"
        >
          <span>View Care Guide</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
