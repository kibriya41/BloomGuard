'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Search,
  Filter,
  Droplets,
  Sun,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Check,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export interface PlantItem {
  id: string;
  name: string;
  scientificName: string;
  category: 'Succulent' | 'Foliage' | 'Flowering' | 'Cacti' | 'Fern' | 'Palm' | 'Herbs';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  light: 'Low' | 'Medium' | 'Bright';
  petFriendly: boolean;
  wateringFrequencyDays: number;
  shortDescription: string;
  image: string;
  popularity: number; // 1-100 for sorting
  createdAt: string;
}

const MOCK_PLANTS: PlantItem[] = [
  {
    id: 'monstera-deliciosa',
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    category: 'Foliage',
    difficulty: 'Easy',
    light: 'Bright',
    petFriendly: false,
    wateringFrequencyDays: 10,
    shortDescription: 'Famous for its distinctive natural leaf holes and iconic tropical foliage statement.',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    popularity: 98,
    createdAt: '2026-01-15',
  },
  {
    id: 'snake-plant',
    name: 'Snake Plant',
    scientificName: 'Dracaena trifasciata',
    category: 'Succulent',
    difficulty: 'Easy',
    light: 'Low',
    petFriendly: false,
    wateringFrequencyDays: 21,
    shortDescription: 'Extremely resilient architectural plant that excels in low-light indoor environments.',
    image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bac?auto=format&fit=crop&w=800&q=80',
    popularity: 95,
    createdAt: '2026-01-20',
  },
  {
    id: 'peace-lily',
    name: 'Peace Lily',
    scientificName: 'Spathiphyllum wallisii',
    category: 'Flowering',
    difficulty: 'Medium',
    light: 'Medium',
    petFriendly: false,
    wateringFrequencyDays: 7,
    shortDescription: 'Elegant indoor bloomer known for lush dark green leaves and crisp white spathes.',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=800&q=80',
    popularity: 90,
    createdAt: '2026-02-01',
  },
  {
    id: 'fiddle-leaf-fig',
    name: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    category: 'Foliage',
    difficulty: 'Hard',
    light: 'Bright',
    petFriendly: false,
    wateringFrequencyDays: 9,
    shortDescription: 'Dramatic indoor tree featuring large fiddle-shaped leaves for bright sunny rooms.',
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    popularity: 92,
    createdAt: '2026-02-10',
  },
  {
    id: 'boston-fern',
    name: 'Boston Fern',
    scientificName: 'Nephrolepis exaltata',
    category: 'Fern',
    difficulty: 'Medium',
    light: 'Medium',
    petFriendly: true,
    wateringFrequencyDays: 4,
    shortDescription: 'Classic lush green fern with graceful feathery fronds that thrive in high humidity.',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    popularity: 84,
    createdAt: '2026-03-01',
  },
  {
    id: 'pothos-golden',
    name: 'Golden Pothos',
    scientificName: 'Epipremnum aureum',
    category: 'Foliage',
    difficulty: 'Easy',
    light: 'Low',
    petFriendly: false,
    wateringFrequencyDays: 12,
    shortDescription: 'Fast-growing trailing vine featuring heart-shaped leaves with bright golden variegation.',
    image: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?auto=format&fit=crop&w=800&q=80',
    popularity: 96,
    createdAt: '2026-03-05',
  },
  {
    id: 'parlor-palm',
    name: 'Parlor Palm',
    scientificName: 'Chamaedorea elegans',
    category: 'Palm',
    difficulty: 'Easy',
    light: 'Medium',
    petFriendly: true,
    wateringFrequencyDays: 8,
    shortDescription: 'Compact tropical palm with delicate fronds, pet-safe and perfect for tabletops.',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    popularity: 88,
    createdAt: '2026-03-12',
  },
  {
    id: 'aloe-vera',
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    category: 'Succulent',
    difficulty: 'Easy',
    light: 'Bright',
    petFriendly: false,
    wateringFrequencyDays: 18,
    shortDescription: 'Useful medicinal succulent with fleshy gel-filled leaves requiring bright light.',
    image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80',
    popularity: 94,
    createdAt: '2026-03-15',
  },
  {
    id: 'bunny-ears-cactus',
    name: 'Bunny Ears Cactus',
    scientificName: 'Opuntia microdasys',
    category: 'Cacti',
    difficulty: 'Easy',
    light: 'Bright',
    petFriendly: false,
    wateringFrequencyDays: 25,
    shortDescription: 'Charming desert cactus with paired ear-like pads and fine golden glochids.',
    image: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?auto=format&fit=crop&w=800&q=80',
    popularity: 82,
    createdAt: '2026-03-18',
  },
  {
    id: 'sweet-basil',
    name: 'Sweet Basil',
    scientificName: 'Ocimum basilicum',
    category: 'Herbs',
    difficulty: 'Medium',
    light: 'Bright',
    petFriendly: true,
    wateringFrequencyDays: 3,
    shortDescription: 'Fragrant culinary herb delivering fresh leaves for kitchen window gardens.',
    image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?auto=format&fit=crop&w=800&q=80',
    popularity: 87,
    createdAt: '2026-03-22',
  },
  {
    id: 'spider-plant',
    name: 'Spider Plant',
    scientificName: 'Chlorophytum comosum',
    category: 'Foliage',
    difficulty: 'Easy',
    light: 'Medium',
    petFriendly: true,
    wateringFrequencyDays: 7,
    shortDescription: 'Adaptable pet-safe favorite producing arching striped leaves and baby spiderettes.',
    image: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?auto=format&fit=crop&w=800&q=80',
    popularity: 91,
    createdAt: '2026-03-25',
  },
  {
    id: 'calathea-orbifolia',
    name: 'Calathea Orbifolia',
    scientificName: 'Goeppertia orbifolia',
    category: 'Foliage',
    difficulty: 'Hard',
    light: 'Medium',
    petFriendly: true,
    wateringFrequencyDays: 5,
    shortDescription: 'Stunning prayer plant boasting oversized round leaves with silver metallic stripes.',
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80',
    popularity: 89,
    createdAt: '2026-03-28',
  },
  {
    id: 'string-of-pearls',
    name: 'String of Pearls',
    scientificName: 'Senecio rowleyanus',
    category: 'Succulent',
    difficulty: 'Hard',
    light: 'Bright',
    petFriendly: false,
    wateringFrequencyDays: 14,
    shortDescription: 'Unique trailing succulent featuring spherical bead-like leaves cascading from pots.',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    popularity: 86,
    createdAt: '2026-04-01',
  },
  {
    id: 'zz-plant',
    name: 'ZZ Plant',
    scientificName: 'Zamioculcas zamiifolia',
    category: 'Foliage',
    difficulty: 'Easy',
    light: 'Low',
    petFriendly: false,
    wateringFrequencyDays: 20,
    shortDescription: 'Glossy dark green stems that thrive on neglect and handle low light effortlessly.',
    image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&w=800&q=80',
    popularity: 97,
    createdAt: '2026-04-05',
  },
  {
    id: 'peperomia-watermelon',
    name: 'Watermelon Peperomia',
    scientificName: 'Peperomia argyreia',
    category: 'Foliage',
    difficulty: 'Medium',
    light: 'Medium',
    petFriendly: true,
    wateringFrequencyDays: 7,
    shortDescription: 'Charming pet-friendly houseplant with leaves mimicking watermelon rinds.',
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    popularity: 85,
    createdAt: '2026-04-10',
  },
  {
    id: 'anthurium-andraeanum',
    name: 'Anthurium',
    scientificName: 'Anthurium andraeanum',
    category: 'Flowering',
    difficulty: 'Medium',
    light: 'Bright',
    petFriendly: false,
    wateringFrequencyDays: 7,
    shortDescription: 'Striking tropical plant featuring long-lasting glossy red heart-shaped flowers.',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=800&q=80',
    popularity: 88,
    createdAt: '2026-04-12',
  },
];

const ITEMS_PER_PAGE = 8;

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedLight, setSelectedLight] = useState<string>('All');
  const [petFriendlyFilter, setPetFriendlyFilter] = useState<string>('All'); // All, Yes, No
  const [sortBy, setSortBy] = useState<string>('popularity'); // popularity, newest, name-asc, name-desc
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch plants from MongoDB Server with local fallback
  const { data: dbData } = useQuery({
    queryKey: ['plants-explore'],
    queryFn: async () => {
      try {
        const res = await api.get('/plants');
        if (res.data?.plants && res.data.plants.length > 0) {
          return res.data.plants.map((p: any) => ({
            id: p._id || p.id,
            name: p.name,
            scientificName: p.scientificName,
            category: p.category,
            difficulty: p.difficulty,
            light: p.light === 'Indirect' ? 'Medium' : p.light,
            petFriendly: p.petFriendly,
            wateringFrequencyDays: p.wateringFrequencyDays || 7,
            shortDescription: p.description,
            image: p.images?.[0] || 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
            popularity: p.popularity || 80,
            createdAt: p.createdAt || new Date().toISOString(),
          }));
        }
      } catch (err) {
        console.log('Using local plant data fallback');
      }
      return MOCK_PLANTS;
    },
  });

  const plantsList: PlantItem[] = dbData || MOCK_PLANTS;

  // Filter & Sort Logic
  const filteredPlants = useMemo(() => {
    return plantsList.filter((plant) => {
      // Search term
      const matchesSearch =
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase());

      // Category
      const matchesCategory =
        selectedCategory === 'All' || plant.category === selectedCategory;

      // Difficulty
      const matchesDifficulty =
        selectedDifficulty === 'All' || plant.difficulty === selectedDifficulty;

      // Light
      const matchesLight =
        selectedLight === 'All' || plant.light === selectedLight;

      // Pet Friendly
      const matchesPet =
        petFriendlyFilter === 'All' ||
        (petFriendlyFilter === 'Yes' && plant.petFriendly) ||
        (petFriendlyFilter === 'No' && !plant.petFriendly);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty &&
        matchesLight &&
        matchesPet
      );
    }).sort((a, b) => {
      if (sortBy === 'popularity') return b.popularity - a.popularity;
      if (sortBy === 'newest')
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });
  }, [
    plantsList,
    searchTerm,
    selectedCategory,
    selectedDifficulty,
    selectedLight,
    petFriendlyFilter,
    sortBy,
  ]);

  // Reset pagination when filters change
  const totalPages = Math.ceil(filteredPlants.length / ITEMS_PER_PAGE);
  const paginatedPlants = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPlants.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPlants, currentPage]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedLight('All');
    setPetFriendlyFilter('All');
    setSortBy('popularity');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedLight !== 'All' ||
    petFriendlyFilter !== 'All';

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        {/* 1. Header Section */}
        <div className="bg-gradient-to-b from-[#F0F4F1] to-[#FAF9F6] border-b border-gray-200/60 pb-12 mb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest/10 text-forest text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Botanical Catalog</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
                Explore Indoor Plants
              </h1>
              <p className="text-gray-600 text-lg sm:text-xl leading-relaxed">
                Discover the perfect houseplants for your light conditions, pet safety needs, and care experience level.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* 2. Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-6 shadow-sm mb-10 space-y-4">
            {/* Top Row: Search & Mobile Filter Toggle */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search input */}
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by plant or scientific name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Controls: Sorting + Mobile Filter Trigger */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <SlidersHorizontal className="w-4 h-4 text-forest" />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-terracotta" />
                  )}
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="hidden sm:inline font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-forest bg-white"
                  >
                    <option value="popularity">Most Popular</option>
                    <option value="newest">Newest Added</option>
                    <option value="name-asc">Name (A–Z)</option>
                    <option value="name-desc">Name (Z–A)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Desktop Filters (Collapsible on Mobile) */}
            <div
              className={`${
                mobileFilterOpen ? 'block' : 'hidden'
              } md:block pt-4 border-t border-gray-100 space-y-4`}
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-forest bg-white"
                  >
                    <option value="All">All Categories</option>
                    <option value="Foliage">Foliage</option>
                    <option value="Succulent">Succulent</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Fern">Fern</option>
                    <option value="Palm">Palm</option>
                    <option value="Cacti">Cacti</option>
                    <option value="Herbs">Herbs</option>
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Difficulty
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => {
                      setSelectedDifficulty(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-forest bg-white"
                  >
                    <option value="All">All Levels</option>
                    <option value="Easy">Easy (Beginner)</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard (Expert)</option>
                  </select>
                </div>

                {/* Light Filter */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Light Requirement
                  </label>
                  <select
                    value={selectedLight}
                    onChange={(e) => {
                      setSelectedLight(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-forest bg-white"
                  >
                    <option value="All">All Light Levels</option>
                    <option value="Low">Low Light</option>
                    <option value="Medium">Medium Light</option>
                    <option value="Bright">Bright Light</option>
                  </select>
                </div>

                {/* Pet Friendly Filter */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    Pet Friendly
                  </label>
                  <select
                    value={petFriendlyFilter}
                    onChange={(e) => {
                      setPetFriendlyFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-forest bg-white"
                  >
                    <option value="All">All Plants</option>
                    <option value="Yes">Pet Safe Only 🐾</option>
                    <option value="No">Toxic to Pets ⚠️</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Chips & Clear */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-semibold text-gray-500">
                      Showing {filteredPlants.length} plants matching filters:
                    </span>
                    {selectedCategory !== 'All' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-forest/10 text-forest text-xs font-semibold">
                        Cat: {selectedCategory}
                      </span>
                    )}
                    {selectedDifficulty !== 'All' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-semibold">
                        Diff: {selectedDifficulty}
                      </span>
                    )}
                    {selectedLight !== 'All' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-100 text-blue-900 text-xs font-semibold">
                        Light: {selectedLight}
                      </span>
                    )}
                    {petFriendlyFilter !== 'All' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 text-xs font-semibold">
                        Pet Safe: {petFriendlyFilter}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleClearFilters}
                    className="flex items-center gap-1 text-xs font-bold text-terracotta hover:underline"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 3. Results Count Bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-semibold text-gray-700">
              Showing <span className="text-forest font-bold">{paginatedPlants.length}</span> of{' '}
              <span className="text-gray-900 font-bold">{filteredPlants.length}</span> species
            </p>
          </div>

          {/* 4. Plant Grid */}
          {filteredPlants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {paginatedPlants.map((plant) => (
                <div
                  key={plant.id}
                  className="group rounded-2xl bg-white border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full"
                >
                  <div>
                    {/* Plant Image Header */}
                    <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={plant.image}
                        alt={plant.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/90 backdrop-blur-md text-gray-800 shadow-sm">
                          {plant.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-2.5 py-1 text-xs font-bold rounded-full border shadow-sm ${
                            plant.difficulty === 'Easy'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : plant.difficulty === 'Medium'
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-rose-100 text-rose-800 border-rose-200'
                          }`}
                        >
                          {plant.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Plant Card Body */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-forest transition-colors">
                          {plant.name}
                        </h3>
                        {plant.petFriendly ? (
                          <span title="Pet Safe" className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                            🐾 Pet Safe
                          </span>
                        ) : (
                          <span title="Toxic to Pets" className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium">
                            ⚠️ Toxic
                          </span>
                        )}
                      </div>

                      <p className="text-xs italic text-gray-500 mb-3">{plant.scientificName}</p>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                        {plant.shortDescription}
                      </p>

                      {/* Plant Attributes Bar */}
                      <div className="grid grid-cols-2 gap-2 py-2.5 px-3 rounded-xl bg-[#F0F4F1]/60 text-xs font-medium text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <Sun className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          <span>{plant.light} Light</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Droplets className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                          <span>Every {plant.wateringFrequencyDays}d</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div className="p-5 pt-0">
                    <Link
                      href={`/plants/${plant.id}`}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-forest text-white text-xs font-bold hover:bg-forest-hover transition-colors shadow-md shadow-forest/10"
                    >
                      <span>View Care Profile</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 5. Empty State */
            <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center max-w-xl mx-auto my-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-terracotta flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">No matching plants found</h3>
              <p className="text-gray-600 text-sm">
                We couldn't find any houseplants matching your current filter selections. Try clearing your search term or adjusting category filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest text-white font-bold text-sm hover:bg-forest-hover shadow-md transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

          {/* 6. Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5 px-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                        currentPage === pageNum
                          ? 'bg-forest text-white shadow-md'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
