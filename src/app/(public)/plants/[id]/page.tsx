'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import {
  ArrowLeft,
  Sun,
  Droplets,
  Thermometer,
  Wind,
  Layers,
  Sprout,
  Plus,
  Check,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Heart,
  Loader2,
} from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

// Extended Detailed Plant Interface
interface DetailedPlant {
  _id: string;
  name: string;
  scientificName: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  light: string;
  water: string;
  wateringFrequencyDays: number;
  humidity: string;
  temperature: string;
  soil?: string;
  growthRate?: string;
  description: string;
  images: string[];
  tags: string[];
  petFriendly: boolean;
  commonIssues?: { issue: string; solution: string }[];
  popularity?: number;
}

// Complete mock dataset for rich fallback details
const MOCK_DETAILED_PLANTS: Record<string, DetailedPlant> = {
  'monstera-deliciosa': {
    _id: 'monstera-deliciosa',
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    category: 'Foliage',
    difficulty: 'Easy',
    light: 'Bright Indirect Light',
    water: 'Water thoroughly when top 2-3 inches of soil feel completely dry.',
    wateringFrequencyDays: 10,
    humidity: 'High (60%+ preferred)',
    temperature: '18°C - 30°C (65°F - 85°F)',
    soil: 'Well-draining rich potting mix with peat moss and perlite',
    growthRate: 'Fast-growing (up to 10 feet indoors with a moss pole)',
    description:
      'Famous for its distinctive natural leaf holes (fenestrations) and iconic tropical statement leaves. The Swiss Cheese Plant thrives in bright indirect light and adds instant jungle luxury to any room.',
    images: [
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['Statement Plant', 'Tropical', 'Air Purifying', 'Fast Grower'],
    petFriendly: false,
    commonIssues: [
      {
        issue: 'Yellowing Leaves',
        solution: 'Usually a sign of overwatering or soil retaining too much moisture. Allow top soil to dry thoroughly.',
      },
      {
        issue: 'Brown Crispy Leaf Tips',
        solution: 'Low ambient room humidity. Mist fronds regularly or group near a humidifier.',
      },
      {
        issue: 'Lack of Leaf Holes',
        solution: 'Young leaves start solid. If mature leaves lack fenestrations, increase bright indirect sunlight exposure.',
      },
    ],
    popularity: 98,
  },
  'snake-plant': {
    _id: 'snake-plant',
    name: 'Snake Plant',
    scientificName: 'Dracaena trifasciata',
    category: 'Succulent',
    difficulty: 'Easy',
    light: 'Low to Bright Light',
    water: 'Water sparingly every 2-3 weeks; allow soil to dry completely.',
    wateringFrequencyDays: 21,
    humidity: 'Low to Average (30-50%)',
    temperature: '15°C - 29°C (60°F - 85°F)',
    soil: 'Cactus or succulent potting mix with coarse sand',
    growthRate: 'Slow to moderate upright growth',
    description:
      'An extremely hardy, architectural succulent plant featuring stiff, sword-like leaves with yellow variegated borders. Known as one of the best bedroom plants for converting CO2 into oxygen overnight.',
    images: [
      'https://images.unsplash.com/photo-1593482892290-f54927ae1bac?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['Indestructible', 'Low Light', 'Bedroom Friendly', 'Air Filter'],
    petFriendly: false,
    commonIssues: [
      {
        issue: 'Mushy Stems or Base Rot',
        solution: 'Overwatering damage. Cut away soft tissue immediately and withhold water for 3 weeks.',
      },
      {
        issue: 'Wrinkled Dull Leaves',
        solution: 'Extreme underwatering. Provide a thorough deep soak until water drains from the bottom.',
      },
    ],
    popularity: 95,
  },
};

export default function PlantDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const plantIdStr = (Array.isArray(id) ? id[0] : id) as string;

  // React Query fetching with fallback to detailed mock object
  const { data: apiData, isLoading } = useQuery({
    queryKey: ['plant-details', plantIdStr],
    queryFn: async () => {
      try {
        const res = await api.get(`/plants/${plantIdStr}`);
        if (res.data?.plant) return res.data;
      } catch (e) {
        console.log('Using local fallback for plant details');
      }
      return null;
    },
  });

  const rawPlant = apiData?.plant;
  const mockFallback = MOCK_DETAILED_PLANTS[plantIdStr] || MOCK_DETAILED_PLANTS['monstera-deliciosa'];

  const plant: DetailedPlant = rawPlant
    ? {
        _id: rawPlant._id,
        name: rawPlant.name,
        scientificName: rawPlant.scientificName,
        category: rawPlant.category,
        difficulty: rawPlant.difficulty,
        light: rawPlant.light,
        water: rawPlant.water,
        wateringFrequencyDays: rawPlant.wateringFrequencyDays || 7,
        humidity: rawPlant.humidity || 'Medium (50%)',
        temperature: rawPlant.temperature || '18°C - 28°C',
        soil: rawPlant.soil || 'Well-draining potting mix',
        growthRate: rawPlant.growthRate || 'Moderate',
        description: rawPlant.description,
        images:
          rawPlant.images && rawPlant.images.length > 0
            ? rawPlant.images
            : mockFallback.images,
        tags: rawPlant.tags || mockFallback.tags,
        petFriendly: rawPlant.petFriendly,
        commonIssues: rawPlant.commonIssues?.length ? rawPlant.commonIssues : mockFallback.commonIssues,
      }
    : mockFallback;

  const rawRelated = apiData?.relatedPlants;

  const relatedPlantsList: { _id: string; name: string; scientificName: string; category: string; image: string }[] =
    rawRelated && rawRelated.length > 0
      ? rawRelated.map((rp: any) => ({
          _id: rp._id,
          name: rp.name,
          scientificName: rp.scientificName,
          category: rp.category,
          image:
            rp.images && rp.images.length > 0
              ? rp.images[0]
              : 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
        }))
      : [
          {
            _id: 'snake-plant',
            name: 'Snake Plant',
            scientificName: 'Dracaena trifasciata',
            category: 'Succulent',
            image: 'https://images.unsplash.com/photo-1585687433141-f1e3f9065f7a?auto=format&fit=crop&w=600&q=80',
          },
          {
            _id: 'spider-plant',
            name: 'Spider Plant',
            scientificName: 'Chlorophytum comosum',
            category: 'Foliage',
            image: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?auto=format&fit=crop&w=600&q=80',
          },
          {
            _id: 'parlor-palm',
            name: 'Parlor Palm',
            scientificName: 'Chamaedorea elegans',
            category: 'Palm',
            image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
          },
        ];

  const dynamicCommonIssues =
    plant.commonIssues && plant.commonIssues.length > 0
      ? plant.commonIssues
      : [
          {
            issue:
              plant.category === 'Succulent' || plant.category === 'Cacti'
                ? 'Mushy Base or Root Rot'
                : 'Yellowing Leaves',
            solution:
              plant.category === 'Succulent' || plant.category === 'Cacti'
                ? 'Usually caused by overwatering or soil retaining excess moisture. Allow soil to dry 100% between waterings.'
                : 'Usually a sign of overwatering or soil retaining too much moisture. Allow top soil to dry thoroughly.',
          },
          {
            issue:
              plant.light?.toLowerCase().includes('bright') || plant.light?.toLowerCase().includes('direct')
                ? 'Pale Foliage & Stretched Stems'
                : 'Brown Crispy Leaf Tips & Edges',
            solution:
              plant.light?.toLowerCase().includes('bright') || plant.light?.toLowerCase().includes('direct')
                ? 'Plant is seeking more sun. Move closer to a bright east or south-facing window.'
                : 'Low ambient room humidity. Mist fronds regularly or group near a room humidifier.',
          },
          {
            issue: 'Slow Seasonal Growth',
            solution:
              'Feed monthly with a balanced organic liquid fertilizer during active spring & summer growth seasons.',
          },
        ];

  // Image Gallery Active State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedToGarden, setAddedToGarden] = useState(false);
  const [addingToGarden, setAddingToGarden] = useState(false);

  const handleAddToGarden = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (addedToGarden) {
      router.push('/my-garden');
      return;
    }
    setAddingToGarden(true);
    try {
      await api.post('/my-garden', {
        plantId: plant._id,
        customName: plant.name,
        scientificName: plant.scientificName,
        category: plant.category,
        images: plant.images,
        wateringFrequencyDays: plant.wateringFrequencyDays,
      });
      setAddedToGarden(true);
      setTimeout(() => router.push('/my-garden'), 1200);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Failed to add plant. Please try again.';
      alert(msg);
    } finally {
      setAddingToGarden(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAF9F6]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-32 pb-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-forest border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-gray-600">Loading botanical profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        {/* Breadcrumb & Navigation */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-forest transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Botanical Catalog</span>
          </Link>
        </div>

        {/* 1. Header & Image Gallery Hero */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-10 shadow-sm">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left Column: Image Gallery (5 cols) */}
              <div className="lg:col-span-6 space-y-4">
                {/* Main Active Image Display */}
                <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-inner">
                  <Image
                    src={plant.images[activeImageIndex] || plant.images[0]}
                    alt={plant.name}
                    fill
                    className="object-cover transition-all duration-500"
                    priority
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/90 backdrop-blur-md text-gray-800 shadow-sm">
                      {plant.category}
                    </span>
                  </div>
                </div>

                {/* Thumbnails Row */}
                {plant.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {plant.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                          activeImageIndex === idx
                            ? 'border-forest ring-2 ring-forest/20 shadow-md scale-105'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${plant.name} view ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Plant Header & Actions (6 cols) */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full border shadow-sm ${
                        plant.difficulty === 'Easy'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : plant.difficulty === 'Medium'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-rose-100 text-rose-800 border-rose-200'
                      }`}
                    >
                      {plant.difficulty} Care
                    </span>

                    {plant.petFriendly ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Pet Safe 🐾</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Toxic to Pets ⚠️</span>
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                    {plant.name}
                  </h1>
                  <p className="text-lg italic font-medium text-forest">{plant.scientificName}</p>
                </div>

                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  {plant.description}
                </p>

                {/* Tags */}
                {plant.tags && plant.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {plant.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-[#F0F4F1] text-gray-700 text-xs font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Primary Action CTA */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToGarden}
                    disabled={addedToGarden || addingToGarden}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-2xl font-bold text-base shadow-lg transition-all ${
                      addedToGarden
                        ? 'bg-emerald-600 text-white'
                        : 'bg-forest text-white hover:bg-forest-hover hover:scale-[1.02] shadow-forest/20 disabled:opacity-70'
                    }`}
                  >
                    {addedToGarden ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Added to Your Garden!</span>
                      </>
                    ) : addingToGarden ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>Add to My Garden</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Care Specifications Grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-2xl mb-8 space-y-2">
            <span className="text-xs font-bold text-forest uppercase tracking-wider">
              Botanical Care Requirements
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Optimal Growing Conditions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Light */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Sunlight Need</h3>
              <p className="text-sm text-gray-700 font-semibold">{plant.light}</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Place near east or west-facing windows. Protect foliage from harsh scorching direct rays.
              </p>
            </div>

            {/* Water */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Watering Schedule</h3>
              <p className="text-sm text-gray-700 font-semibold">Every {plant.wateringFrequencyDays} days</p>
              <p className="text-xs text-gray-500 leading-relaxed">{plant.water}</p>
            </div>

            {/* Humidity */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Humidity Level</h3>
              <p className="text-sm text-gray-700 font-semibold">{plant.humidity}</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Mist leaves twice weekly or place on a pebble tray during dry winter heating months.
              </p>
            </div>

            {/* Temperature */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Thermometer className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Temperature</h3>
              <p className="text-sm text-gray-700 font-semibold">{plant.temperature}</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Keep away from cold AC drafts, exterior doors, and direct heating radiators.
              </p>
            </div>

            {/* Soil */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100/60 text-amber-800 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Soil Mixture</h3>
              <p className="text-sm text-gray-700 font-semibold">{plant.soil}</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Repot every 12–18 months in fresh well-draining soil with bottom drainage holes.
              </p>
            </div>

            {/* Growth Rate */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Growth Rate</h3>
              <p className="text-sm text-gray-700 font-semibold">{plant.growthRate}</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Feed monthly with balanced organic liquid fertilizer during spring & summer active seasons.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Common Issues & Solutions (Troubleshooting & Diagnostics) */}
        {dynamicCommonIssues.length > 0 && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="bg-white rounded-3xl border border-gray-200/80 p-8 sm:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-amber-100 text-terracotta">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">
                    Troubleshooting & Diagnostics
                  </h2>
                  <p className="text-xs font-semibold text-gray-500">
                    Early signs of plant distress and proven botanical solutions
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {dynamicCommonIssues.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-[#FAF9F6] border border-gray-200/80 space-y-2 hover:border-amber-200 transition-colors"
                  >
                    <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-terracotta flex-shrink-0" />
                      <span>{item.issue}</span>
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed pl-4">
                      {item.solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. Similar Botanical Species Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Similar Botanical Species
            </h2>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 font-bold text-sm text-forest hover:underline"
            >
              <span>Explore All</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPlantsList.map((relatedPlant) => (
              <div
                key={relatedPlant._id}
                className="group rounded-2xl bg-white border border-gray-200/80 p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={relatedPlant.image}
                      alt={relatedPlant.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-forest transition-colors">
                      {relatedPlant.name}
                    </h3>
                    <p className="text-xs text-gray-500 italic">{relatedPlant.scientificName}</p>
                  </div>
                </div>
                <Link
                  href={`/plants/${relatedPlant._id}`}
                  className="block text-center py-2.5 rounded-xl bg-sage-light text-forest text-xs font-bold hover:bg-forest hover:text-white transition-all duration-200 mt-4"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
