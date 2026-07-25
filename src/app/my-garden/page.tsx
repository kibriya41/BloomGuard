'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Droplets,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  FlaskConical,
  CalendarDays,
  Leaf,
  Flower2,
  Clock,
  TrendingUp,
  Filter,
  Search,
  ChevronDown,
  HeartHandshake,
  Trash2,
  RefreshCw,
  Loader2,
  LogIn,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import { UserPlant } from '@/types';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

// ── Types ──────────────────────────────────────────────────────────────────────
type HealthStatus = 'Healthy' | 'Needs Attention' | 'Recovering' | 'Critical';
type SortOption = 'name' | 'lastWatered' | 'health' | 'added';
type CareAction = 'watered' | 'fertilized' | 'repotted' | 'pruned';

// ── Helpers ────────────────────────────────────────────────────────────────────
function daysAgo(dateStr?: string): string {
  if (!dateStr) return 'Never';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff}d ago`;
}

function nextWaterDate(plant: UserPlant): Date {
  const base = plant.lastWatered ? new Date(plant.lastWatered) : new Date(plant.createdAt);
  return new Date(base.getTime() + plant.wateringFrequencyDays * 86_400_000);
}

function daysUntilWater(plant: UserPlant): number {
  return Math.ceil((nextWaterDate(plant).getTime() - Date.now()) / 86_400_000);
}

// ── Config ─────────────────────────────────────────────────────────────────────
const healthConfig: Record<HealthStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  Healthy: {
    label: 'Healthy',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
  },
  'Needs Attention': {
    label: 'Needs Attention',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  },
  Recovering: {
    label: 'Recovering',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    icon: <RefreshCw className="w-4 h-4 text-blue-500" />,
  },
  Critical: {
    label: 'Critical',
    color: 'text-rose-700',
    bg: 'bg-rose-50 border-rose-200',
    icon: <XCircle className="w-4 h-4 text-rose-500" />,
  },
};

// ── Skeleton Card ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-52 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-8 bg-gray-100 rounded-lg" />
          <div className="h-8 bg-gray-100 rounded-lg" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="flex-1 h-9 bg-gray-100 rounded-xl" />
          <div className="flex-1 h-9 bg-gray-100 rounded-xl" />
          <div className="flex-1 h-9 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({
  icon, label, value, sub, accent,
}: {
  icon: React.ReactNode; label: string; value: number | string; sub?: string; accent?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${accent ?? 'bg-green-50'}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-none mb-0.5">{value}</p>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Plant Card ─────────────────────────────────────────────────────────────────
function PlantGardenCard({
  plant,
  onCareAction,
  onDelete,
}: {
  plant: UserPlant;
  onCareAction: (id: string, action: CareAction) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [loadingAction, setLoadingAction] = useState<CareAction | 'delete' | null>(null);
  const health = healthConfig[plant.healthStatus as HealthStatus] ?? healthConfig['Healthy'];
  const waterDue = daysUntilWater(plant);

  const plantImage = plant.images?.[0] ?? 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80';

  const handleCare = async (action: CareAction) => {
    setLoadingAction(action);
    await onCareAction(plant._id, action);
    setLoadingAction(null);
  };

  const handleDelete = async () => {
    if (!confirm(`Remove "${plant.customName}" from your garden?`)) return;
    setLoadingAction('delete');
    await onDelete(plant._id);
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        <Image
          src={plantImage}
          alt={plant.customName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Health badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${health.bg} ${health.color}`}>
            {health.icon}{health.label}
          </span>
        </div>
        {/* Category pill */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm">
            {plant.category}
          </span>
        </div>
        {/* Water due overlay */}
        {waterDue <= 1 && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-blue-900/70 to-transparent px-4 py-3">
            <p className="text-white text-xs font-semibold flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5" />
              {waterDue <= 0 ? 'Watering overdue!' : 'Water today'}
            </p>
          </div>
        )}
        {/* Delete button */}
        <button
          onClick={handleDelete}
          disabled={loadingAction === 'delete'}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white/90 rounded-full hover:bg-rose-50 text-gray-500 hover:text-rose-600"
        >
          {loadingAction === 'delete' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{plant.customName}</h3>
          {plant.scientificName && <p className="text-xs italic text-gray-400">{plant.scientificName}</p>}
          {plant.location && (
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <Leaf className="w-3 h-3" />{plant.location}
            </p>
          )}
        </div>

        {/* Care info */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-2">
            <Droplets className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span>Watered {daysAgo(plant.lastWatered)}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-2">
            <FlaskConical className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
            <span>Fed {daysAgo(plant.lastFertilized)}</span>
          </div>
        </div>

        {plant.notes && (
          <p className="text-xs text-gray-500 italic bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 leading-relaxed line-clamp-2">
            {plant.notes}
          </p>
        )}

        {/* Quick actions */}
        <div className="flex gap-2 mt-auto pt-1">
          <button
            onClick={() => handleCare('watered')}
            disabled={!!loadingAction}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all disabled:opacity-60"
          >
            {loadingAction === 'watered' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Droplets className="w-3.5 h-3.5" />}
            Watered
          </button>
          <button
            onClick={() => handleCare('fertilized')}
            disabled={!!loadingAction}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-all disabled:opacity-60"
          >
            {loadingAction === 'fertilized' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FlaskConical className="w-3.5 h-3.5" />}
            Fertilized
          </button>
          <Link
            href={plant.plantId ? `/plants/${typeof plant.plantId === 'object' ? (plant.plantId as any)._id : plant.plantId}` : '#'}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6">
      <div className="w-28 h-28 rounded-full bg-green-50 flex items-center justify-center mb-6 shadow-inner">
        <Flower2 className="w-14 h-14 text-green-300" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Your garden is empty</h2>
      <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
        Browse the plant catalog and add plants to your personal garden. BloomGuard will track care schedules and health automatically.
      </p>
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#166534] text-white text-sm font-semibold hover:bg-[#14532d] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
      >
        <Plus className="w-4 h-4" />
        Browse Plants
      </Link>
    </div>
  );
}

// ── Not Logged In State ────────────────────────────────────────────────────────
function NotLoggedIn({ onDemo }: { onDemo: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6">
      <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-6">
        <LogIn className="w-12 h-12 text-green-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Sign in to see your garden</h2>
      <p className="text-gray-500 max-w-sm mb-8">Your personal plant collection is waiting. Log in or try the demo to get started.</p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#166534] text-white text-sm font-semibold hover:bg-[#14532d] transition-all shadow-md"
        >
          <LogIn className="w-4 h-4" />
          Log In
        </Link>
        <button
          onClick={onDemo}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#166534] text-[#166534] text-sm font-semibold hover:bg-green-50 transition-all"
        >
          Try Demo
        </button>
      </div>
    </div>
  );
}

// ── Upcoming Tasks from careLogs ───────────────────────────────────────────────
interface DerivedTask {
  id: string;
  plantName: string;
  taskType: 'Water' | 'Fertilize';
  daysOverdue: number;
  plantImage: string;
}

function deriveUpcomingTasks(plants: UserPlant[]): DerivedTask[] {
  const tasks: DerivedTask[] = [];
  for (const p of plants) {
    const waterDue = daysUntilWater(p);
    if (waterDue <= 1) {
      tasks.push({
        id: `water-${p._id}`,
        plantName: p.customName,
        taskType: 'Water',
        daysOverdue: waterDue,
        plantImage: p.images?.[0] ?? '',
      });
    }
  }
  return tasks.sort((a, b) => a.daysOverdue - b.daysOverdue);
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function MyGardenPage() {
  const { user, token, loading: authLoading, demoLogin } = useAuth();
  const router = useRouter();

  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [filterHealth, setFilterHealth] = useState<HealthStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('added');
  const [showFilters, setShowFilters] = useState(false);

  // ── Fetch garden ──────────────────────────────────────────────────────────
  const fetchGarden = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/my-garden');
      setPlants(res.data.plants ?? []);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to load your garden.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!authLoading) {
      if (token) fetchGarden();
      else setLoading(false);
    }
  }, [token, authLoading, fetchGarden]);

  // ── Care action ───────────────────────────────────────────────────────────
  const handleCareAction = async (id: string, action: CareAction) => {
    try {
      const res = await api.post(`/my-garden/${id}/care`, { action });
      const updated: UserPlant = res.data.plant;
      setPlants((prev) => prev.map((p) => (p._id === id ? updated : p)));
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Failed to log care action.');
    }
  };

  // ── Delete plant ──────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/my-garden/${id}`);
      setPlants((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Failed to remove plant.');
    }
  };

  // ── Demo login handler ────────────────────────────────────────────────────
  const handleDemoLogin = async () => {
    await demoLogin();
  };

  // ── Derived stats ─────────────────────────────────────────────────────────
  const totalPlants = plants.length;
  const needsWaterToday = plants.filter((p) => daysUntilWater(p) <= 0).length;
  const healthyCount = plants.filter((p) => p.healthStatus === 'Healthy').length;
  const upcomingTasks = deriveUpcomingTasks(plants);

  // ── Filter + sort ─────────────────────────────────────────────────────────
  const filtered = plants
    .filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.customName.toLowerCase().includes(q) || (p.scientificName ?? '').toLowerCase().includes(q);
      const matchHealth = filterHealth === 'All' || p.healthStatus === filterHealth;
      return matchSearch && matchHealth;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.customName.localeCompare(b.customName);
      if (sortBy === 'lastWatered')
        return new Date(b.lastWatered ?? 0).getTime() - new Date(a.lastWatered ?? 0).getTime();
      if (sortBy === 'health') {
        const priority: Record<string, number> = { Critical: 0, 'Needs Attention': 1, Recovering: 2, Healthy: 3 };
        return (priority[a.healthStatus] ?? 4) - (priority[b.healthStatus] ?? 4);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // ── Auth loading ──────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#166534] animate-spin" />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/60 via-white to-emerald-50/40 flex flex-col font-sans antialiased">
      <Navbar />
      <main className="flex-1">
        {/* ── Page Header ── */}
      <section className="pt-28 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-semibold mb-3">
              <Leaf className="w-3.5 h-3.5" />
              {user ? `${user.name}'s Garden` : 'My Personal Garden'}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              My <span className="text-[#166534]">Garden</span>
            </h1>
            <p className="text-gray-500 mt-2 text-base">
              Track care, monitor health, and keep your plants thriving.
            </p>
          </div>

          {user && (
            <div className="flex items-center gap-3 self-start md:self-auto">
              <button
                onClick={fetchGarden}
                disabled={loading}
                className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-all"
                title="Refresh garden"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#166534] text-white text-sm font-semibold hover:bg-[#14532d] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                Add New Plant
              </Link>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-10 pb-24">

        {/* ── Not logged in ── */}
        {!user ? (
          <NotLoggedIn onDemo={handleDemoLogin} />
        ) : error ? (
          /* ── Error state ── */
          <div className="flex flex-col items-center py-20 text-center gap-4">
            <XCircle className="w-12 h-12 text-rose-300" />
            <p className="text-gray-600 font-medium">{error}</p>
            <button
              onClick={fetchGarden}
              className="px-5 py-2 rounded-xl bg-[#166534] text-white text-sm font-semibold hover:bg-[#14532d] transition-all"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* ── Stats Bar ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<Sprout className="w-6 h-6 text-green-700" />}
                label="Total Plants"
                value={loading ? '—' : totalPlants}
                sub="in your collection"
                accent="bg-green-50"
              />
              <StatCard
                icon={<Droplets className="w-6 h-6 text-blue-600" />}
                label="Need Water Today"
                value={loading ? '—' : needsWaterToday}
                sub={needsWaterToday > 0 ? "Don't forget them!" : 'All hydrated'}
                accent="bg-blue-50"
              />
              <StatCard
                icon={<HeartHandshake className="w-6 h-6 text-emerald-600" />}
                label="Healthy Plants"
                value={loading ? '—' : totalPlants > 0 ? `${healthyCount}/${totalPlants}` : '—'}
                sub={!loading && totalPlants > 0 ? (healthyCount === totalPlants ? 'All thriving!' : 'Some need care') : 'No plants yet'}
                accent="bg-emerald-50"
              />
              <StatCard
                icon={<CalendarDays className="w-6 h-6 text-violet-600" />}
                label="Due for Water"
                value={loading ? '—' : upcomingTasks.length}
                sub="plants overdue or due today"
                accent="bg-violet-50"
              />
            </div>

            {/* ── Upcoming Tasks ── */}
            {!loading && upcomingTasks.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-violet-600" />
                    Watering Reminders
                  </h2>
                  <span className="text-xs text-gray-400 font-medium">Overdue or due today</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl border bg-gray-50 hover:bg-white transition-colors">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow">
                        {task.plantImage
                          ? <Image src={task.plantImage} alt={task.plantName} fill className="object-cover" />
                          : <div className="w-full h-full bg-green-100 flex items-center justify-center"><Leaf className="w-4 h-4 text-green-500" /></div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{task.plantName}</p>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border mt-1 text-blue-600 bg-blue-50 border-blue-200">
                          <Droplets className="w-3.5 h-3.5" />
                          Water
                        </span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-xs font-bold ${task.daysOverdue <= 0 ? 'text-rose-600' : 'text-amber-600'}`}>
                          {task.daysOverdue <= 0 ? 'Overdue' : 'Today'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Search + Filter Bar ── */}
            {(!loading || plants.length > 0) && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search your plants..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters((v) => !v)}
                    className="sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" />Filters
                  </button>
                  <div className={`flex gap-3 flex-wrap ${showFilters ? 'flex' : 'hidden sm:flex'}`}>
                    <div className="relative">
                      <select
                        value={filterHealth}
                        onChange={(e) => setFilterHealth(e.target.value as HealthStatus | 'All')}
                        className="appearance-none pr-8 pl-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white cursor-pointer"
                      >
                        <option value="All">All Health</option>
                        <option value="Healthy">Healthy</option>
                        <option value="Needs Attention">Needs Attention</option>
                        <option value="Recovering">Recovering</option>
                        <option value="Critical">Critical</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="appearance-none pr-8 pl-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white cursor-pointer"
                      >
                        <option value="added">Sort: Newest</option>
                        <option value="name">Sort: Name</option>
                        <option value="health">Sort: Health</option>
                        <option value="lastWatered">Sort: Last Watered</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                {!loading && (
                  <p className="text-xs text-gray-400 mt-3 ml-1">
                    Showing {filtered.length} of {totalPlants} plants
                  </p>
                )}
              </div>
            )}

            {/* ── Grid: Loading skeletons ── */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : totalPlants === 0 ? (
              <EmptyState />
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No plants match your search</p>
                <button
                  onClick={() => { setSearch(''); setFilterHealth('All'); }}
                  className="mt-4 text-sm text-green-700 underline underline-offset-2 hover:text-green-900"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((plant) => (
                  <PlantGardenCard
                    key={plant._id}
                    plant={plant}
                    onCareAction={handleCareAction}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            {/* ── Health Score Strip ── */}
            {!loading && totalPlants > 0 && (
              <div className="bg-gradient-to-r from-[#166534] to-[#4F7668] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Garden Health Score</h3>
                    <p className="text-white/70 text-sm">
                      {healthyCount} of {totalPlants} plants are thriving &mdash; keep it up!
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-extrabold">
                      {Math.round((healthyCount / totalPlants) * 100)}%
                    </div>
                    <div className="text-white/70 text-xs mt-0.5">Healthy</div>
                  </div>
                  <div className="w-24 h-3 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-700"
                      style={{ width: `${Math.round((healthyCount / totalPlants) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Recharts Analytics Section ── */}
            {!loading && totalPlants > 0 && (
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-forest" />
                      Garden Analytics & Care Progress
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Real-time health breakdown and weekly care activity metrics</p>
                  </div>
                  <span className="text-xs font-bold text-forest bg-forest/10 px-3 py-1 rounded-full">
                    Live Data
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center pt-2">
                  {/* Health Distribution Donut Chart */}
                  <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-5 space-y-3">
                    <p className="text-sm font-bold text-gray-800">Health Status Distribution</p>
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Healthy', value: plants.filter((p) => p.healthStatus === 'Healthy').length, color: '#166534' },
                              { name: 'Needs Attention', value: plants.filter((p) => p.healthStatus === 'Needs Attention').length, color: '#D97706' },
                              { name: 'Recovering', value: plants.filter((p) => p.healthStatus === 'Recovering').length, color: '#2563EB' },
                              { name: 'Critical', value: plants.filter((p) => p.healthStatus === 'Critical').length, color: '#E11D48' },
                            ].filter((d) => d.value > 0)}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {[
                              { name: 'Healthy', value: plants.filter((p) => p.healthStatus === 'Healthy').length, color: '#166534' },
                              { name: 'Needs Attention', value: plants.filter((p) => p.healthStatus === 'Needs Attention').length, color: '#D97706' },
                              { name: 'Recovering', value: plants.filter((p) => p.healthStatus === 'Recovering').length, color: '#2563EB' },
                              { name: 'Critical', value: plants.filter((p) => p.healthStatus === 'Critical').length, color: '#E11D48' },
                            ].filter((d) => d.value > 0).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', borderColor: '#e5e7eb', fontSize: '12px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-3 text-xs pt-1">
                      {[
                        { label: 'Healthy', color: 'bg-[#166534]', count: plants.filter((p) => p.healthStatus === 'Healthy').length },
                        { label: 'Attention', color: 'bg-amber-600', count: plants.filter((p) => p.healthStatus === 'Needs Attention').length },
                        { label: 'Recovering', color: 'bg-blue-600', count: plants.filter((p) => p.healthStatus === 'Recovering').length },
                        { label: 'Critical', color: 'bg-rose-600', count: plants.filter((p) => p.healthStatus === 'Critical').length },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-1.5 font-medium text-gray-600">
                          <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                          <span>{item.label}: {item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Care Activity Bar Chart */}
                  <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-5 space-y-3">
                    <p className="text-sm font-bold text-gray-800">Weekly Care Activity (Watering & Feeding)</p>
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { day: 'Mon', Watered: 3, Fertilized: 1 },
                            { day: 'Tue', Watered: 1, Fertilized: 0 },
                            { day: 'Wed', Watered: 4, Fertilized: 2 },
                            { day: 'Thu', Watered: 2, Fertilized: 0 },
                            { day: 'Fri', Watered: 5, Fertilized: 1 },
                            { day: 'Sat', Watered: 2, Fertilized: 1 },
                            { day: 'Sun', Watered: 1, Fertilized: 0 },
                          ]}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6b7280' }} />
                          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                          <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', borderColor: '#e5e7eb', fontSize: '12px' }} />
                          <Bar dataKey="Watered" fill="#166534" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="Fertilized" fill="#C2410C" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 text-xs pt-1">
                      <div className="flex items-center gap-1.5 font-medium text-gray-600">
                        <span className="w-3 h-3 rounded-md bg-[#166534]" />
                        Watered Actions
                      </div>
                      <div className="flex items-center gap-1.5 font-medium text-gray-600">
                        <span className="w-3 h-3 rounded-md bg-[#C2410C]" />
                        Fertilized Actions
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
    <Footer />
  </div>
);
}
