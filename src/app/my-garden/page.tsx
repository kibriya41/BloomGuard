'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import {
  Plus,
  Droplets,
  Heart,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Sprout,
  Check,
  RotateCcw,
  Sun,
  ShieldCheck,
  Search,
} from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export interface UserPlantItem {
  id: string;
  customName: string;
  originalName: string;
  category: string;
  image: string;
  healthStatus: 'Healthy' | 'Needs Attention' | 'Critical';
  lastWatered: string; // YYYY-MM-DD
  nextWateringDue: string; // YYYY-MM-DD
  waterNeedDays: number;
  location: string;
}

const INITIAL_USER_PLANTS: UserPlantItem[] = [
  {
    id: 'up-1',
    customName: 'Monty the Monstera',
    originalName: 'Monstera Deliciosa',
    category: 'Foliage',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    healthStatus: 'Healthy',
    lastWatered: '2026-07-20',
    nextWateringDue: '2026-07-25', // Today
    waterNeedDays: 10,
    location: 'Living Room East Window',
  },
  {
    id: 'up-2',
    customName: 'Snakey',
    originalName: 'Snake Plant',
    category: 'Succulent',
    image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bac?auto=format&fit=crop&w=800&q=80',
    healthStatus: 'Healthy',
    lastWatered: '2026-07-10',
    nextWateringDue: '2026-07-31',
    waterNeedDays: 21,
    location: 'Bedroom Bookshelf',
  },
  {
    id: 'up-3',
    customName: 'Lily',
    originalName: 'Peace Lily',
    category: 'Flowering',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=800&q=80',
    healthStatus: 'Needs Attention',
    lastWatered: '2026-07-17',
    nextWateringDue: '2026-07-24', // Yesterday
    waterNeedDays: 7,
    location: 'Dining Room Table',
  },
  {
    id: 'up-4',
    customName: 'Figgy Stardust',
    originalName: 'Fiddle Leaf Fig',
    category: 'Foliage',
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    healthStatus: 'Critical',
    lastWatered: '2026-07-12',
    nextWateringDue: '2026-07-21',
    waterNeedDays: 9,
    location: 'Balcony Doorway',
  },
  {
    id: 'up-5',
    customName: 'Goldie',
    originalName: 'Golden Pothos',
    category: 'Foliage',
    image: 'https://images.unsplash.com/photo-1596724817763-9219f67ea89a?auto=format&fit=crop&w=800&q=80',
    healthStatus: 'Healthy',
    lastWatered: '2026-07-18',
    nextWateringDue: '2026-07-30',
    waterNeedDays: 12,
    location: 'Kitchen Hanging Basket',
  },
  {
    id: 'up-6',
    customName: 'Palmy',
    originalName: 'Parlor Palm',
    category: 'Palm',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    healthStatus: 'Healthy',
    lastWatered: '2026-07-22',
    nextWateringDue: '2026-07-30',
    waterNeedDays: 8,
    location: 'Home Office Desk',
  },
];

export default function MyGardenPage() {
  const { user } = useAuth();
  const [userPlants, setUserPlants] = useState<UserPlantItem[]>(INITIAL_USER_PLANTS);
  const [wateredNotice, setWateredNotice] = useState<string | null>(null);

  // Fetch garden list from MongoDB Server with fallback
  const { data: dbData } = useQuery({
    queryKey: ['my-garden-list'],
    queryFn: async () => {
      try {
        const res = await api.get('/my-garden');
        if (res.data?.userPlants && res.data.userPlants.length > 0) {
          return res.data.userPlants.map((item: any) => ({
            id: item._id || item.id,
            customName: item.nickname || item.plantId?.name || 'My Plant',
            originalName: item.plantId?.name || 'Indoor Plant',
            category: item.plantId?.category || 'Foliage',
            image: item.plantId?.images?.[0] || 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
            healthStatus: item.healthStatus || 'Healthy',
            lastWatered: item.lastWatered ? item.lastWatered.split('T')[0] : '2026-07-20',
            nextWateringDue: item.nextWateringDate ? item.nextWateringDate.split('T')[0] : '2026-07-25',
            waterNeedDays: item.plantId?.wateringFrequencyDays || 7,
            location: item.location || 'Living Room',
          }));
        }
      } catch (e) {
        console.log('Using local fallback for user garden');
      }
      return null;
    },
  });

  const activePlantsList = dbData && dbData.length > 0 ? dbData : userPlants;

  // Interactive Action: Watered Today
  const handleWaterPlant = (id: string, name: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setUserPlants((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            lastWatered: todayStr,
            healthStatus: 'Healthy',
          };
        }
        return p;
      })
    );
    setWateredNotice(`Watered ${name}! Health updated to Healthy.`);
    setTimeout(() => setWateredNotice(null), 3000);
  };

  // Stats Counters
  const totalCount = activePlantsList.length;
  const healthyCount = activePlantsList.filter((p) => p.healthStatus === 'Healthy').length;
  const attentionCount = activePlantsList.filter((p) => p.healthStatus !== 'Healthy').length;
  const waterTodayCount = activePlantsList.filter(
    (p) => p.healthStatus !== 'Healthy' || p.nextWateringDue <= '2026-07-25'
  ).length;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        {/* 1. Page Header */}
        <div className="bg-gradient-to-b from-[#F0F4F1] to-[#FAF9F6] border-b border-gray-200/60 pb-10 mb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-bold uppercase tracking-wider mb-2">
                  <Sprout className="w-3.5 h-3.5" />
                  <span>Digital Plant Collection</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                  My Garden
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Track moisture levels, log fertilization, and keep your indoor plants thriving.
                </p>
              </div>

              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-forest text-white font-bold text-sm shadow-md shadow-forest/20 hover:bg-forest-hover transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Plant</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Notification Toast */}
          {wateredNotice && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-700 text-white font-bold text-sm shadow-lg flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                <span>{wateredNotice}</span>
              </div>
            </div>
          )}

          {/* 2. Stats / Overview Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
            {/* Stat 1 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center font-bold text-xl">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Plants</p>
                <p className="text-2xl font-black text-gray-900">{totalCount}</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Need Water</p>
                <p className="text-2xl font-black text-blue-600">{waterTodayCount}</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Thriving</p>
                <p className="text-2xl font-black text-emerald-600">{healthyCount}</p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Needs Attention</p>
                <p className="text-2xl font-black text-amber-600">{attentionCount}</p>
              </div>
            </div>
          </div>

          {/* 3. Plant Collection Grid */}
          {activePlantsList.length > 0 ? (
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Your Plant Sanctuary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activePlantsList.map((plant) => (
                    <div
                      key={plant.id}
                      className="group rounded-2xl bg-white border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Image & Badges */}
                        <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                          <Image
                            src={plant.image}
                            alt={plant.customName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/90 backdrop-blur-md text-gray-800 shadow-sm">
                              {plant.location}
                            </span>
                          </div>

                          <div className="absolute top-3 right-3">
                            <span
                              className={`px-3 py-1 text-xs font-extrabold rounded-full border shadow-sm ${
                                plant.healthStatus === 'Healthy'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                  : plant.healthStatus === 'Needs Attention'
                                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                                  : 'bg-rose-100 text-rose-800 border-rose-200'
                              }`}
                            >
                              {plant.healthStatus}
                            </span>
                          </div>
                        </div>

                        {/* Info Body */}
                        <div className="p-5 space-y-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-forest transition-colors">
                              {plant.customName}
                            </h3>
                            <p className="text-xs text-gray-500 italic">{plant.originalName}</p>
                          </div>

                          <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs font-semibold text-gray-600">
                            <div>
                              <span className="block text-[10px] uppercase text-gray-400 font-bold">Last Watered</span>
                              <span className="text-gray-800">{plant.lastWatered}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] uppercase text-gray-400 font-bold">Frequency</span>
                              <span className="text-gray-800">Every {plant.waterNeedDays} days</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleWaterPlant(plant.id, plant.customName)}
                          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all"
                        >
                          <Droplets className="w-3.5 h-3.5" />
                          <span>Watered Today</span>
                        </button>

                        <Link
                          href={`/plants/${plant.id}`}
                          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-forest text-white text-xs font-bold hover:bg-forest-hover transition-colors shadow-sm"
                        >
                          <span>View Profile</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Upcoming Care Schedule Section */}
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900">Upcoming Care Reminders</h2>
                    <p className="text-xs font-semibold text-gray-500">Tasks scheduled for this week</p>
                  </div>
                  <Calendar className="w-5 h-5 text-forest" />
                </div>

                <div className="space-y-3">
                  {activePlantsList.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl bg-[#FAF9F6] border border-gray-100 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0">
                          <Image src={p.image} alt={p.customName} fill className="object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{p.customName}</h4>
                          <p className="text-xs text-gray-500">Scheduled: Watering ({p.location})</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleWaterPlant(p.id, p.customName)}
                        className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-colors"
                      >
                        Mark Done
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* 5. Empty State */
            <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center max-w-lg mx-auto my-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto">
                <Sprout className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Your Garden is Empty</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                You haven't added any indoor plants to your personal collection yet. Explore our botanical database to add your first plant companion!
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest text-white font-bold text-sm hover:bg-forest-hover shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Explore Plant Catalog</span>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
