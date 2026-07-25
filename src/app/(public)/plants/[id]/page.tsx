'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Plant } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Sun, Droplets, Thermometer, Wind, AlertTriangle, CheckCircle2, Plus } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export default function PlantDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['plant', id],
    queryFn: async () => {
      const res = await api.get(`/plants/${id}`);
      return res.data;
    }
  });

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12 flex justify-center"><div className="w-12 h-12 border-4 border-forest border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (error || !data) {
    return <div className="container mx-auto px-4 py-12 text-center text-red-500">Error loading plant details.</div>;
  }

  const { plant, relatedPlants }: { plant: Plant, relatedPlants: Plant[] } = data;

  const handleAddToGarden = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(`/plants/add?plantId=${plant._id}`);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-sage-light py-8 border-b border-border-color">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href="/explore" className="inline-flex items-center gap-2 text-gray-500 hover:text-forest transition-colors mb-6 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
              <Image 
                src={plant.images[0] || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80'}
                alt={plant.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-forest text-sm font-bold shadow-sm mb-4">
                {plant.category}
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">{plant.name}</h1>
              <p className="text-xl text-gray-500 italic mb-6">{plant.scientificName}</p>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {plant.description}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                {plant.tags.map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={handleAddToGarden}
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-forest text-white font-bold hover:bg-forest-hover transition-colors shadow-lg shadow-forest/20"
                >
                  <Plus className="w-5 h-5" /> Add to My Garden
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Care Guide Section */}
      <div className="container mx-auto px-4 max-w-6xl py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Care Guide</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <CareCard 
            icon={<Sun className="w-6 h-6 text-amber-500" />}
            title="Light"
            value={plant.light}
            colorClass="bg-amber-50 border-amber-100"
          />
          <CareCard 
            icon={<Droplets className="w-6 h-6 text-blue-500" />}
            title="Water"
            value={plant.water}
            subtitle={`Every ${plant.wateringFrequencyDays} days`}
            colorClass="bg-blue-50 border-blue-100"
          />
          <CareCard 
            icon={<Wind className="w-6 h-6 text-teal-500" />}
            title="Humidity"
            value={plant.humidity}
            colorClass="bg-teal-50 border-teal-100"
          />
          <CareCard 
            icon={<Thermometer className="w-6 h-6 text-rose-500" />}
            title="Temperature"
            value={plant.temperature}
            colorClass="bg-rose-50 border-rose-100"
          />
        </div>

        {/* Details Matrix */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Common Issues */}
          {plant.commonIssues && plant.commonIssues.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-terracotta" /> Common Issues
              </h3>
              <div className="space-y-4">
                {plant.commonIssues.map((issue, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-2">{issue.issue}</h4>
                    <p className="text-gray-600 text-sm">{issue.solution}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Facts */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
               Quick Facts
            </h3>
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 space-y-4">
              <FactRow label="Difficulty" value={plant.difficulty} />
              <FactRow label="Pet Friendly" value={plant.petFriendly ? 'Yes' : 'No - Toxic if ingested'} alert={!plant.petFriendly} />
              <FactRow label="Category" value={plant.category} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CareCard({ icon, title, value, subtitle, colorClass }: { icon: React.ReactNode, title: string, value: string, subtitle?: string, colorClass: string }) {
  return (
    <div className={`p-6 rounded-3xl border ${colorClass} shadow-sm`}>
      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-700 font-medium mb-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}

function FactRow({ label, value, alert }: { label: string, value: string, alert?: boolean }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0 last:pb-0">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className={`font-bold ${alert ? 'text-red-500' : 'text-gray-900'}`}>{value}</span>
    </div>
  );
}
