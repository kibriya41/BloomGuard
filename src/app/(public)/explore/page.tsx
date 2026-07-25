'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Plant } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, Droplets, Sun, Activity } from 'lucide-react';

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: ['plants', searchTerm, category],
    queryFn: async () => {
      const res = await api.get('/plants', {
        params: { search: searchTerm, category }
      });
      return res.data;
    }
  });

  const plants: Plant[] = data?.plants || [];
  
  const categories = ['All', 'Foliage', 'Succulent', 'Flowering', 'Fern', 'Palm', 'Cactus'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Explore Plants</h1>
        <p className="text-gray-600 max-w-2xl text-lg">Browse our directory of indoor plants to find the perfect addition to your space. Learn about their care requirements and discover what suits your home.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search plants by name..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat === 'All' ? '' : cat)}
              className={`px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                (category === cat || (cat === 'All' && !category))
                  ? 'bg-forest text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl p-4 h-80 border border-gray-100">
              <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plants.map((plant) => (
            <Link key={plant._id} href={`/plants/${plant._id}`} className="group block">
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                  <Image 
                    src={plant.images[0] || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80'} 
                    alt={plant.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
                    {plant.category}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{plant.name}</h3>
                  <p className="text-sm text-gray-500 italic mb-4">{plant.scientificName}</p>
                  
                  <div className="mt-auto grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Sun className="w-4 h-4 text-amber-500 mb-1" />
                      <span className="text-[10px] text-gray-500 font-medium uppercase">{plant.light}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center border-x border-gray-100">
                      <Droplets className="w-4 h-4 text-blue-500 mb-1" />
                      <span className="text-[10px] text-gray-500 font-medium uppercase">{plant.wateringFrequencyDays} Days</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center">
                      <Activity className="w-4 h-4 text-emerald-500 mb-1" />
                      <span className="text-[10px] text-gray-500 font-medium uppercase">{plant.difficulty}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {plants.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              No plants found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
