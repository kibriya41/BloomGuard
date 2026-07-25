'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Eye,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  MapPin,
  Calendar,
  Droplets,
  ArrowUpDown,
  AlertCircle,
  X,
  Loader2,
  Sprout,
  SlidersHorizontal,
} from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/authContext';

// ── Types ──────────────────────────────────────────────────────────────────────
type HealthStatus = 'Healthy' | 'Needs Attention' | 'Recovering' | 'Critical';
type CategoryFilter = 'All' | 'Foliage' | 'Succulent' | 'Flowering' | 'Fern' | 'Palm' | 'Cacti' | 'Herb' | 'Other';
type HealthFilter = 'All' | HealthStatus;
type SortBy = 'name' | 'category' | 'health' | 'lastWatered' | 'location';

interface ManagePlantItem {
  _id: string;
  customName: string;
  scientificName?: string;
  category: string;
  healthStatus: HealthStatus;
  lastWatered?: string;
  location: string;
  images: string[];
  wateringFrequencyDays: number;
  createdAt?: string;
}

// ── Fallback Mock Plants (6–8 plants) ──────────────────────────────────────────
const MOCK_MANAGE_PLANTS: ManagePlantItem[] = [
  {
    _id: 'monstera-deliciosa',
    customName: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    category: 'Foliage',
    healthStatus: 'Healthy',
    lastWatered: '2026-07-20',
    location: 'Living Room',
    images: ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80'],
    wateringFrequencyDays: 10,
    createdAt: '2026-01-15',
  },
  {
    _id: 'snake-plant',
    customName: 'Snake Plant',
    scientificName: 'Dracaena trifasciata',
    category: 'Succulent',
    healthStatus: 'Healthy',
    lastWatered: '2026-07-05',
    location: 'Bedroom Window',
    images: ['https://images.unsplash.com/photo-1585687433141-f1e3f9065f7a?auto=format&fit=crop&w=800&q=80'],
    wateringFrequencyDays: 21,
    createdAt: '2026-02-10',
  },
  {
    _id: 'peace-lily',
    customName: 'Peace Lily',
    scientificName: 'Spathiphyllum wallisii',
    category: 'Flowering',
    healthStatus: 'Needs Attention',
    lastWatered: '2026-07-18',
    location: 'Dining Area',
    images: ['https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?auto=format&fit=crop&w=800&q=80'],
    wateringFrequencyDays: 5,
    createdAt: '2026-03-01',
  },
  {
    _id: 'fiddle-leaf-fig',
    customName: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    category: 'Foliage',
    healthStatus: 'Critical',
    lastWatered: '2026-07-12',
    location: 'Study Room',
    images: ['https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80'],
    wateringFrequencyDays: 7,
    createdAt: '2026-03-20',
  },
  {
    _id: 'golden-pothos',
    customName: 'Golden Pothos',
    scientificName: 'Epipremnum aureum',
    category: 'Foliage',
    healthStatus: 'Healthy',
    lastWatered: '2026-07-22',
    location: 'Kitchen Shelf',
    images: ['https://images.unsplash.com/photo-1572688484438-313a6e50c333?auto=format&fit=crop&w=800&q=80'],
    wateringFrequencyDays: 7,
    createdAt: '2026-04-05',
  },
  {
    _id: 'parlor-palm',
    customName: 'Parlor Palm',
    scientificName: 'Chamaedorea elegans',
    category: 'Palm',
    healthStatus: 'Recovering',
    lastWatered: '2026-07-19',
    location: 'Balcony Entrance',
    images: ['https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'],
    wateringFrequencyDays: 8,
    createdAt: '2026-04-18',
  },
  {
    _id: 'boston-fern',
    customName: 'Boston Fern',
    scientificName: 'Nephrolepis exaltata',
    category: 'Fern',
    healthStatus: 'Needs Attention',
    lastWatered: '2026-07-21',
    location: 'Bathroom',
    images: ['https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80'],
    wateringFrequencyDays: 4,
    createdAt: '2026-05-02',
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatDate(dateStr?: string): string {
  if (!dateStr) return 'Not set';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysAgo(dateStr?: string): string {
  if (!dateStr) return 'Never';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 0) return 'Scheduled';
  return `${diff}d ago`;
}

// Health Status Badge Component
function HealthBadge({ status }: { status: HealthStatus }) {
  switch (status) {
    case 'Healthy':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Healthy
        </span>
      );
    case 'Needs Attention':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          Needs Attention
        </span>
      );
    case 'Recovering':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
          Recovering
        </span>
      );
    case 'Critical':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-500" />
          Critical
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
          {status}
        </span>
      );
  }
}

export default function ManagePlantsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [plants, setPlants] = useState<ManagePlantItem[]>(MOCK_MANAGE_PLANTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [selectedHealth, setSelectedHealth] = useState<HealthFilter>('All');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Delete modal state
  const [plantToDelete, setPlantToDelete] = useState<ManagePlantItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedPlants.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedPlants.map((p) => p._id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected plant(s)? This cannot be undone.`)) return;
    setBulkDeleting(true);
    const ids = Array.from(selectedIds);
    await Promise.all(ids.map((id) => api.delete(`/my-garden/${id}`).catch(() => {})));
    setPlants((prev) => prev.filter((p) => !selectedIds.has(p._id)));
    setSelectedIds(new Set());
    setBulkDeleting(false);
    showToast(`Removed ${ids.length} plant(s) from your collection.`);
  };

  // Fetch plants from backend
  const fetchPlants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/my-garden');
      if (res.data?.plants && Array.isArray(res.data.plants)) {
        const mapped: ManagePlantItem[] = res.data.plants.map((p: any) => ({
          _id: p._id,
          customName: p.customName || p.plantId?.name || 'Unnamed Plant',
          scientificName: p.plantId?.scientificName || p.scientificName || '',
          category: p.plantId?.category || p.category || 'Foliage',
          healthStatus: p.healthStatus || 'Healthy',
          lastWatered: p.lastWatered,
          location: p.location || 'Indoor Garden',
          images: p.images?.length
            ? p.images
            : p.plantId?.images?.length
            ? p.plantId.images
            : ['https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80'],
          wateringFrequencyDays: p.wateringFrequencyDays || p.plantId?.wateringFrequencyDays || 7,
          createdAt: p.createdAt,
        }));
        setPlants(mapped.length > 0 ? mapped : MOCK_MANAGE_PLANTS);
      } else {
        setPlants(MOCK_MANAGE_PLANTS);
      }
    } catch (err) {
      console.log('Using mock manage plants dataset');
      setPlants(MOCK_MANAGE_PLANTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  // Show temporary toast message
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Delete Action Handler
  const handleDeleteConfirm = async () => {
    if (!plantToDelete) return;
    setDeletingId(plantToDelete._id);

    try {
      await api.delete(`/my-garden/${plantToDelete._id}`);
      showToast(`"${plantToDelete.customName}" was removed from your collection.`);
    } catch (e) {
      // Local removal if backend fails or using mock
      showToast(`Removed "${plantToDelete.customName}" from list.`);
    }

    setPlants((prev) => prev.filter((p) => p._id !== plantToDelete._id));
    setDeletingId(null);
    setPlantToDelete(null);
  };

  // Filter & Sort Logic
  const filteredAndSortedPlants = useMemo(() => {
    return plants
      .filter((plant) => {
        const matchesSearch =
          plant.customName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (plant.scientificName && plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          plant.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'All' || plant.category === selectedCategory;
        const matchesHealth = selectedHealth === 'All' || plant.healthStatus === selectedHealth;

        return matchesSearch && matchesCategory && matchesHealth;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'name') {
          comparison = a.customName.localeCompare(b.customName);
        } else if (sortBy === 'category') {
          comparison = a.category.localeCompare(b.category);
        } else if (sortBy === 'health') {
          comparison = a.healthStatus.localeCompare(b.healthStatus);
        } else if (sortBy === 'lastWatered') {
          const dateA = a.lastWatered ? new Date(a.lastWatered).getTime() : 0;
          const dateB = b.lastWatered ? new Date(b.lastWatered).getTime() : 0;
          comparison = dateA - dateB;
        } else if (sortBy === 'location') {
          comparison = a.location.localeCompare(b.location);
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [plants, searchQuery, selectedCategory, selectedHealth, sortBy, sortOrder]);

  const toggleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col font-sans antialiased text-gray-800">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className="bg-forest text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-700/50">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-semibold mb-2">
                <Sprout className="w-3.5 h-3.5" />
                Garden Inventory
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Manage My Plants
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                View, organize, update, and manage all your home plants in one central dashboard.
              </p>
            </div>

            <Link
              href="/plants/add"
              className="inline-flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta/90 text-white font-semibold px-6 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-sm whitespace-nowrap self-start md:self-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Plant</span>
            </Link>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-sm mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search plant by name, species, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filter Selectors */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Category Dropdown */}
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs sm:text-sm">
                  <Filter className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-500 font-medium hidden sm:inline">Category:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as CategoryFilter)}
                    className="bg-transparent font-semibold text-gray-800 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Foliage">Foliage</option>
                    <option value="Succulent">Succulent</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Fern">Fern</option>
                    <option value="Palm">Palm</option>
                    <option value="Cacti">Cacti</option>
                    <option value="Herb">Herb</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Health Filter */}
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs sm:text-sm">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-500 font-medium hidden sm:inline">Health:</span>
                  <select
                    value={selectedHealth}
                    onChange={(e) => setSelectedHealth(e.target.value as HealthFilter)}
                    className="bg-transparent font-semibold text-gray-800 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Health Status</option>
                    <option value="Healthy">Healthy</option>
                    <option value="Needs Attention">Needs Attention</option>
                    <option value="Recovering">Recovering</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                {/* Clear Filters Button */}
                {(searchQuery || selectedCategory !== 'All' || selectedHealth !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedHealth('All');
                    }}
                    className="text-xs text-terracotta hover:underline font-semibold px-2 py-1"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bulk Action Bar */}
          {selectedIds.size > 0 && (
            <div className="bg-forest/5 border border-forest/20 rounded-2xl px-5 py-3 mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-forest text-white text-xs font-bold flex items-center justify-center">
                  {selectedIds.size}
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {selectedIds.size === 1 ? '1 plant selected' : `${selectedIds.size} plants selected`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkDeleting}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 rounded-lg disabled:opacity-60 transition-colors"
                >
                  {bulkDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* Plant List / Table View */}
          {loading ? (
            <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center shadow-sm">
              <Loader2 className="w-8 h-8 text-forest animate-spin mx-auto mb-3" />
              <p className="text-gray-500 font-medium text-sm">Loading your plants inventory...</p>
            </div>

          ) : filteredAndSortedPlants.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center shadow-sm space-y-4 max-w-xl mx-auto my-8">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-forest flex items-center justify-center mx-auto mb-2">
                <Sprout className="w-8 h-8 text-forest" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No Plants Found</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                {searchQuery || selectedCategory !== 'All' || selectedHealth !== 'All'
                  ? 'No plants match your current filter settings. Try adjusting your search term or clearing filters.'
                  : "You haven't added any plants to your collection yet. Start building your garden now!"}
              </p>
              <div className="pt-2">
                {searchQuery || selectedCategory !== 'All' || selectedHealth !== 'All' ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedHealth('All');
                    }}
                    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <Link
                    href="/plants/add"
                    className="inline-flex items-center gap-2 bg-forest hover:bg-forest/90 text-white font-semibold px-6 py-3 rounded-2xl text-sm shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Your First Plant</span>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden lg:block bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#FAF9F6] border-b border-gray-200/80 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                        <th className="py-4 pl-5 pr-2 w-10">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-forest focus:ring-forest/20 cursor-pointer"
                            checked={filteredAndSortedPlants.length > 0 && selectedIds.size === filteredAndSortedPlants.length}
                            onChange={toggleSelectAll}
                            title="Select all"
                          />
                        </th>
                        <th className="py-4 px-4">Plant</th>
                        <th className="py-4 px-4 cursor-pointer hover:text-gray-800" onClick={() => toggleSort('category')}>
                          <div className="flex items-center gap-1.5">
                            <span>Category</span>
                            <ArrowUpDown className="w-3.5 h-3.5" />
                          </div>
                        </th>
                        <th className="py-4 px-4 cursor-pointer hover:text-gray-800" onClick={() => toggleSort('health')}>
                          <div className="flex items-center gap-1.5">
                            <span>Health Status</span>
                            <ArrowUpDown className="w-3.5 h-3.5" />
                          </div>
                        </th>
                        <th className="py-4 px-4 cursor-pointer hover:text-gray-800" onClick={() => toggleSort('location')}>
                          <div className="flex items-center gap-1.5">
                            <span>Location</span>
                            <ArrowUpDown className="w-3.5 h-3.5" />
                          </div>
                        </th>
                        <th className="py-4 px-4 cursor-pointer hover:text-gray-800" onClick={() => toggleSort('lastWatered')}>
                          <div className="flex items-center gap-1.5">
                            <span>Last Watered</span>
                            <ArrowUpDown className="w-3.5 h-3.5" />
                          </div>
                        </th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredAndSortedPlants.map((plant) => (
                        <tr key={plant._id} className={`hover:bg-emerald-50/30 transition-colors group ${selectedIds.has(plant._id) ? 'bg-forest/5' : ''}`}>
                          {/* Checkbox */}
                          <td className="py-4 pl-5 pr-2">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-forest focus:ring-forest/20 cursor-pointer"
                              checked={selectedIds.has(plant._id)}
                              onChange={() => toggleSelect(plant._id)}
                            />
                          </td>
                          {/* Plant Info */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-4">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200/60 shadow-xs">
                                <Image
                                  src={plant.images[0]}
                                  alt={plant.customName}
                                  fill
                                  sizes="48px"
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-base">{plant.customName}</h4>
                                {plant.scientificName && (
                                  <p className="text-xs text-gray-500 italic">{plant.scientificName}</p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-4 px-4">
                            <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                              {plant.category}
                            </span>
                          </td>

                          {/* Health Status */}
                          <td className="py-4 px-4">
                            <HealthBadge status={plant.healthStatus} />
                          </td>

                          {/* Location */}
                          <td className="py-4 px-4 text-gray-600 font-medium">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              <span>{plant.location}</span>
                            </div>
                          </td>

                          {/* Last Watered */}
                          <td className="py-4 px-4 text-gray-600">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-800">{daysAgo(plant.lastWatered)}</span>
                              <span className="text-xs text-gray-400">{formatDate(plant.lastWatered)}</span>
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* View Details */}
                              <Link
                                href={`/plants/${plant._id}`}
                                title="View details"
                                className="p-2 rounded-xl text-gray-600 hover:text-forest hover:bg-forest/10 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>

                              {/* Edit Action (Redirects to add or edit) */}
                              <Link
                                href={`/plants/add`}
                                title="Edit plant"
                                className="p-2 rounded-xl text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Link>

                              {/* Delete Action */}
                              <button
                                onClick={() => setPlantToDelete(plant)}
                                title="Delete plant"
                                className="p-2 rounded-xl text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MOBILE CARD VIEW */}
              <div className="grid sm:grid-cols-2 gap-4 lg:hidden mb-8">
                {filteredAndSortedPlants.map((plant) => (
                  <div
                    key={plant._id}
                    className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                        <Image
                          src={plant.images[0]}
                          alt={plant.customName}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-gray-900 text-base truncate">{plant.customName}</h4>
                          <HealthBadge status={plant.healthStatus} />
                        </div>
                        {plant.scientificName && (
                          <p className="text-xs text-gray-500 italic truncate mb-1">{plant.scientificName}</p>
                        )}
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600">
                          {plant.category}
                        </span>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                      <div>
                        <span className="text-gray-400 block mb-0.5">Location</span>
                        <span className="font-semibold text-gray-700 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {plant.location}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block mb-0.5">Last Watered</span>
                        <span className="font-semibold text-gray-700 flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-blue-500" />
                          {daysAgo(plant.lastWatered)}
                        </span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100">
                      <Link
                        href={`/plants/${plant._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 border border-gray-200"
                      >
                        <Eye className="w-3.5 h-3.5 text-forest" />
                        <span>View</span>
                      </Link>

                      <Link
                        href={`/plants/add`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 border border-gray-200"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Edit</span>
                      </Link>

                      <button
                        onClick={() => setPlantToDelete(plant)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* DELETE CONFIRMATION MODAL DIALOG */}
      {plantToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-gray-100 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 border border-rose-100">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Remove Plant?</h3>
                <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                <Image
                  src={plantToDelete.images[0]}
                  alt={plantToDelete.customName}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{plantToDelete.customName}</p>
                {plantToDelete.scientificName && (
                  <p className="text-xs text-gray-500 italic truncate">{plantToDelete.scientificName}</p>
                )}
                <span className="text-[11px] text-gray-400">{plantToDelete.location}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-gray-900">{plantToDelete.customName}</strong> from your plant inventory? All watering logs and care records for this plant will be permanently removed.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPlantToDelete(null)}
                disabled={deletingId !== null}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deletingId !== null}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-colors shadow-md disabled:opacity-50"
              >
                {deletingId !== null ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Plant</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
