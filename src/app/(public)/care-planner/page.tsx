'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Calendar,
  Leaf,
  Droplets,
  Sun,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Loader2,
  ChevronRight,
  Flower2,
  Home,
  Thermometer,
  Wind,
  Lightbulb,
  Info,
  ArrowRight,
  Sprout,
  Users,
  Plus,
} from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/authContext';

// ── Types ─────────────────────────────────────────────────────────────────────
interface DaySchedule {
  day: string;
  tasks: string[];
  priority: 'high' | 'medium' | 'low';
}

interface ProactiveAlert {
  plantName: string;
  type: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
}

interface CompanionSuggestion {
  name: string;
  reason: string;
  benefit: string;
}

interface CarePlan {
  summary: { totalPlants: number; healthyCount: number; attentionNeededCount: number; criticalCount: number };
  weeklySchedule: DaySchedule[];
  proactiveAlerts: ProactiveAlert[];
  companionSuggestions: CompanionSuggestion[];
  weeklyTip: string;
  source?: string;
}

interface Environment {
  lightLevel: string;
  humidity: number;
  season: string;
  homeType: string;
}

// ── Day Color Map ──────────────────────────────────────────────────────────────
const DAY_COLORS: Record<string, string> = {
  Monday: 'bg-forest text-white',
  Tuesday: 'bg-blue-600 text-white',
  Wednesday: 'bg-terracotta text-white',
  Thursday: 'bg-purple-600 text-white',
  Friday: 'bg-amber-500 text-white',
  Saturday: 'bg-sage text-white',
  Sunday: 'bg-rose-400 text-white',
};

const PRIORITY_CONFIG = {
  high: { label: 'High Priority', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
  medium: { label: 'Medium', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  low: { label: 'Routine', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
};

const ALERT_CONFIG = {
  critical: { icon: <XCircle className="w-5 h-5 text-rose-500" />, bg: 'bg-rose-50 border-rose-200', label: 'Critical' },
  warning: { icon: <AlertTriangle className="w-5 h-5 text-amber-500" />, bg: 'bg-amber-50 border-amber-200', label: 'Warning' },
  info: { icon: <Info className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50 border-blue-200', label: 'Info' },
};

// ── Schedule Skeleton ─────────────────────────────────────────────────────────
function ScheduleSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-2xl h-36" />
      ))}
    </div>
  );
}

export default function CarePlannerPage() {
  const { user } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<CarePlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [environment, setEnvironment] = useState<Environment>({
    lightLevel: 'Bright Indirect',
    humidity: 55,
    season: 'Summer',
    homeType: 'Apartment',
  });
  const [generated, setGenerated] = useState(false);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await api.post('/ai/care-plan', { environment });
      setPlan(res.data);
      setGenerated(true);
    } catch (err: any) {
      setError('Could not connect to the AI planner. Please make sure the backend server is running.');
    } finally {
      setGenerating(false);
    }
  }, [environment]);

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col font-sans antialiased">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* ── Page Hero ─────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-forest via-emerald-800 to-emerald-900 text-white py-16 sm:py-20 relative overflow-hidden">
          {/* Background decorative blobs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-200 text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Botanical Intelligence</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
                Your Personalized<br />
                <span className="text-emerald-300">AI Care Planner</span>
              </h1>
              <p className="text-emerald-100 text-lg sm:text-xl max-w-2xl leading-relaxed">
                Tell us about your home environment and BloomGuard's agentic AI will analyze your entire garden to generate a custom weekly care schedule, proactive health alerts, and companion planting suggestions.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl space-y-10">

          {/* ── Environment Setup ─────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Home Environment Setup</h2>
                <p className="text-gray-500 text-sm">Help the AI understand your indoor conditions</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Light Level */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <Sun className="w-4 h-4 text-amber-500" />
                  Light Level
                </label>
                <select
                  value={environment.lightLevel}
                  onChange={(e) => setEnvironment((p) => ({ ...p, lightLevel: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest bg-gray-50"
                >
                  <option>Low Light (North Window)</option>
                  <option>Bright Indirect</option>
                  <option>Bright Direct</option>
                  <option>Mixed / Variable</option>
                </select>
              </div>

              {/* Humidity */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <Wind className="w-4 h-4 text-blue-500" />
                  Avg. Humidity: <span className="text-forest ml-1">{environment.humidity}%</span>
                </label>
                <input
                  type="range"
                  min={20}
                  max={90}
                  value={environment.humidity}
                  onChange={(e) => setEnvironment((p) => ({ ...p, humidity: Number(e.target.value) }))}
                  className="w-full accent-forest"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>20% Dry</span>
                  <span>90% Humid</span>
                </div>
              </div>

              {/* Season */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <Leaf className="w-4 h-4 text-forest" />
                  Current Season
                </label>
                <select
                  value={environment.season}
                  onChange={(e) => setEnvironment((p) => ({ ...p, season: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest bg-gray-50"
                >
                  <option>Spring</option>
                  <option>Summer</option>
                  <option>Autumn</option>
                  <option>Winter</option>
                </select>
              </div>

              {/* Home Type */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <Home className="w-4 h-4 text-sage" />
                  Home Type
                </label>
                <select
                  value={environment.homeType}
                  onChange={(e) => setEnvironment((p) => ({ ...p, homeType: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest bg-gray-50"
                >
                  <option>Apartment</option>
                  <option>House with Garden</option>
                  <option>Studio / Small Space</option>
                  <option>Office</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-forest hover:bg-forest/90 text-white font-bold text-base shadow-xl shadow-forest/20 hover:shadow-forest/30 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:scale-100"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>AI is analyzing your garden...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{generated ? 'Regenerate Care Plan' : 'Generate My Care Plan'}</span>
                  </>
                )}
              </button>
              {!user && (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl flex items-center gap-2">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>
                    <Link href="/login" className="font-bold underline">Log in</Link> to get a plan personalized to your actual garden.
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* ── Error State ───────────────────────────────────────────────── */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-center gap-3 text-rose-700">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* ── Loading Skeleton ──────────────────────────────────────────── */}
          {generating && (
            <div className="space-y-8">
              <div>
                <div className="h-7 bg-gray-200 rounded-xl w-64 mb-4 animate-pulse" />
                <ScheduleSkeleton />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-2xl h-32 animate-pulse" />
                ))}
              </div>
            </div>
          )}

          {/* ── Care Plan Results ─────────────────────────────────────────── */}
          {plan && !generating && (
            <div className="space-y-10">

              {/* Summary Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Plants', value: plan.summary.totalPlants, icon: <Leaf className="w-5 h-5" />, color: 'text-forest', bg: 'bg-forest/10' },
                  { label: 'Healthy', value: plan.summary.healthyCount, icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Need Attention', value: plan.summary.attentionNeededCount, icon: <AlertTriangle className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Critical', value: plan.summary.criticalCount, icon: <XCircle className="w-5 h-5" />, color: 'text-rose-600', bg: 'bg-rose-50' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center flex-shrink-0`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Weekly AI Tip */}
              {plan.weeklyTip && (
                <div className="bg-gradient-to-r from-forest/5 to-emerald-50 border border-forest/20 rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-forest text-white flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-forest uppercase tracking-wider mb-1">Weekly Botanical Wisdom</p>
                    <p className="text-gray-700 text-sm leading-relaxed font-medium">{plan.weeklyTip}</p>
                  </div>
                </div>
              )}

              {/* Weekly Schedule Grid */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-forest" />
                    Weekly Care Schedule
                  </h2>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    AI Generated
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {plan.weeklySchedule.map((day) => {
                    const priorityConf = PRIORITY_CONFIG[day.priority] || PRIORITY_CONFIG.low;
                    return (
                      <div
                        key={day.day}
                        className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className={`px-4 py-3 ${DAY_COLORS[day.day] || 'bg-gray-600 text-white'}`}>
                          <p className="font-extrabold text-base">{day.day}</p>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${day.priority === 'high' ? 'bg-white/30 text-white' : 'bg-white/20 text-white/90'}`}>
                            {priorityConf.label}
                          </span>
                        </div>
                        <ul className="p-4 space-y-2">
                          {day.tasks.map((task, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-forest mt-2 flex-shrink-0" />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Proactive Alerts */}
              {plan.proactiveAlerts && plan.proactiveAlerts.length > 0 && (
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                    Proactive Health Alerts
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {plan.proactiveAlerts.map((alert, i) => {
                      const config = ALERT_CONFIG[alert.severity] || ALERT_CONFIG.info;
                      return (
                        <div key={i} className={`${config.bg} border rounded-2xl p-5 flex items-start gap-4`}>
                          <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-gray-900 text-sm">{alert.plantName}</p>
                              <span className="text-xs text-gray-500 bg-white/70 px-2 py-0.5 rounded-full border border-gray-200/50">{alert.type}</span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{alert.message}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Companion Planting Suggestions */}
              {plan.companionSuggestions && plan.companionSuggestions.length > 0 && (
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
                    <Users className="w-6 h-6 text-sage" />
                    Companion Planting Suggestions
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {plan.companionSuggestions.map((suggestion, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md transition-shadow space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-sage/10 text-sage flex items-center justify-center">
                          <Flower2 className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-gray-900">{suggestion.name}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">{suggestion.reason}</p>
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                          <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                            <span className="font-bold">Benefit: </span>{suggestion.benefit}
                          </p>
                        </div>
                        <Link
                          href="/explore"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:underline"
                        >
                          View in catalog <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Plants CTA */}
              {plan.summary.totalPlants === 0 && (
                <div className="bg-forest/5 border border-forest/20 rounded-3xl p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto">
                    <Sprout className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Start Your Garden</h3>
                  <p className="text-gray-600 text-sm max-w-md mx-auto">
                    Your care plan will become even more personalized once you add real plants to your garden!
                  </p>
                  <Link
                    href="/plants/add"
                    className="inline-flex items-center gap-2 bg-forest text-white font-semibold px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Your First Plant
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ── Initial Empty State ───────────────────────────────────────── */}
          {!plan && !generating && !error && (
            <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center space-y-5 shadow-sm max-w-2xl mx-auto">
              <div className="w-20 h-20 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto">
                <Calendar className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Ready to Plan Your Garden Care?</h3>
              <p className="text-gray-500 text-base leading-relaxed max-w-md mx-auto">
                Configure your home environment above and click <strong>"Generate My Care Plan"</strong> to receive a personalized, AI-crafted weekly care schedule for all your plants.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { icon: <Calendar className="w-6 h-6 text-forest" />, label: '7-Day Schedule' },
                  { icon: <AlertTriangle className="w-6 h-6 text-amber-500" />, label: 'Health Alerts' },
                  { icon: <Flower2 className="w-6 h-6 text-sage" />, label: 'Companion Tips' },
                ].map((f) => (
                  <div key={f.label} className="text-center space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex justify-center">{f.icon}</div>
                    <p className="text-xs font-semibold text-gray-600">{f.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
