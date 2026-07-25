'use client';

import React from 'react';
import Link from 'next/link';
import {
  Leaf,
  Sparkles,
  Heart,
  Shield,
  Users,
  Bot,
  Camera,
  Droplets,
  Bell,
  ArrowRight,
  Code2,
  Database,
  Zap,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const TEAM = [
  {
    name: 'Dr. Amara Chen',
    role: 'Founder & Botanical AI Lead',
    bio: 'Plant biologist with 12+ years studying tropical ecosystems. Obsessed with making botanical expertise accessible to everyone.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    tag: 'Botany PhD',
  },
  {
    name: 'Marcus Osei',
    role: 'Chief AI Engineer',
    bio: 'Ex-Google ML engineer specializing in computer vision. Trained the plant identification model on 2M+ botanical images.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    tag: 'AI Expert',
  },
  {
    name: 'Sophia Rivera',
    role: 'Head of UX & Community',
    bio: "Passionate indoor gardener who turned her 73-plant apartment into a proof of concept for BloomGuard's care algorithms.",
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    tag: 'Plant Parent',
  },
];

const TECH_STACK = [
  { icon: <Code2 className="w-5 h-5" />, name: 'Next.js 15', desc: 'App Router + TypeScript', color: 'text-blue-600 bg-blue-50 border-blue-100' },
  { icon: <Zap className="w-5 h-5" />, name: 'OpenAI GPT-4o', desc: 'Vision + Chat AI', color: 'text-purple-600 bg-purple-50 border-purple-100' },
  { icon: <Database className="w-5 h-5" />, name: 'MongoDB', desc: 'Flexible data storage', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { icon: <Globe className="w-5 h-5" />, name: 'Node.js + Express', desc: 'Scalable REST API', color: 'text-amber-600 bg-amber-50 border-amber-100' },
];

const VALUES = [
  {
    icon: <Heart className="w-6 h-6 text-rose-500" />,
    title: 'Plant-First Philosophy',
    desc: 'Every feature we build starts with a simple question: does this help plants live longer and healthier lives?',
    bg: 'bg-rose-50 border-rose-100',
  },
  {
    icon: <Shield className="w-6 h-6 text-blue-600" />,
    title: 'Privacy by Design',
    desc: 'Your plant data is yours. We never sell, share, or monetize your personal garden information.',
    bg: 'bg-blue-50 border-blue-100',
  },
  {
    icon: <Users className="w-6 h-6 text-forest" />,
    title: 'Community Driven',
    desc: 'Every feature roadmap item is voted on by our community of plant parents. Your voice shapes BloomGuard.',
    bg: 'bg-emerald-50 border-emerald-100',
  },
  {
    icon: <Sparkles className="w-6 h-6 text-amber-500" />,
    title: 'AI with Purpose',
    desc: 'We believe AI should empower, not replace. Our AI assistant teaches you to become a better plant parent.',
    bg: 'bg-amber-50 border-amber-100',
  },
];

const MILESTONES = [
  { year: '2023', event: 'BloomGuard founded after seeing too many avoidable plant deaths', icon: '🌱' },
  { year: 'Jan 2024', event: 'AI plant identification model trained on 2 million botanical images', icon: '🤖' },
  { year: 'Jun 2024', event: 'Beta launched — 5,000 plant parents joined in the first week', icon: '🚀' },
  { year: 'Dec 2024', event: 'Reached 50,000 active users and 200,000+ plants tracked', icon: '🌿' },
  { year: '2025', event: 'Launched Care Planner, AI Chat, and companion planting features', icon: '✨' },
  { year: 'Now', event: 'Continuously growing with the most passionate plant community online', icon: '🌎' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col font-sans antialiased">
      <Navbar />

      <main className="flex-1 pt-16">

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-br from-forest via-emerald-800 to-emerald-900 text-white py-24 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-20 w-72 h-72 bg-terracotta/10 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-sm font-semibold mb-8">
              <Leaf className="w-4 h-4" />
              Our Story
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              We're on a Mission to Keep<br />
              <span className="text-emerald-300">Every Plant Alive</span>
            </h1>
            <p className="text-emerald-100 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              BloomGuard was born out of frustration — too many beautiful plants dying unnecessarily because their owners just needed the right guidance at the right moment. We combined botanical science with AI to create the world's most intelligent plant care companion.
            </p>
          </div>
        </section>

        {/* ── Stats Banner ─────────────────────────────────────────────────── */}
        <section className="bg-white border-b border-gray-100 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: '50,000+', label: 'Active Plant Parents', color: 'text-forest' },
                { value: '200,000+', label: 'Plants Tracked', color: 'text-terracotta' },
                { value: '10,000+', label: 'Species Database', color: 'text-sage' },
                { value: '98%', label: 'Plant Survival Rate', color: 'text-amber-600' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className={`text-3xl sm:text-4xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mission ──────────────────────────────────────────────────────── */}
        <section className="py-20 bg-[#FAF9F6]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-xs font-bold text-forest uppercase tracking-wider">Our Mission</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  Democratizing Expert Plant Care for Everyone
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Not everyone has access to a botanist, a knowledgeable plant shop, or years of trial-and-error experience. BloomGuard puts that expert knowledge — backed by AI — directly in the pockets of every plant parent, whether you own 1 plant or 100.
                </p>
                <ul className="space-y-3">
                  {[
                    'AI that learns from your specific plants and home environment',
                    'Species-accurate care guidance for 10,000+ indoor plant varieties',
                    'Proactive health monitoring before problems escalate',
                    'Community-driven knowledge and shared discoveries',
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-forest flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-forest text-white font-semibold px-6 py-3 rounded-2xl shadow-md hover:shadow-lg hover:bg-forest/90 transition-all"
                >
                  Join BloomGuard Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1585687433141-f1e3f9065f7a?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1593482892290-f54927ae1bac?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80',
                ].map((src, i) => (
                  <div key={i} className={`relative rounded-2xl overflow-hidden bg-gray-100 ${i === 0 ? 'row-span-2' : ''}`} style={{ height: i === 0 ? '280px' : '130px' }}>
                    <img src={src} alt="Plant" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Core Values ──────────────────────────────────────────────────── */}
        <section className="py-20 bg-white border-y border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-terracotta uppercase tracking-wider">What We Believe</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">Our Core Values</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {VALUES.map((value) => (
                <div key={value.title} className={`${value.bg} border rounded-2xl p-6 space-y-3`}>
                  <div className="w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
                    {value.icon}
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-lg">{value.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ─────────────────────────────────────────────────────────── */}
        <section className="py-20 bg-[#FAF9F6]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-forest uppercase tracking-wider">Meet the Team</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
                Built by Plant Lovers, for Plant Lovers
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {TEAM.map((member) => (
                <div key={member.name} className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm text-center space-y-4 hover:shadow-md transition-shadow">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto ring-4 ring-forest/10">
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-forest/10 text-forest mb-2">
                      {member.tag}
                    </span>
                    <h3 className="font-extrabold text-gray-900 text-lg">{member.name}</h3>
                    <p className="text-sm text-sage font-semibold">{member.role}</p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Timeline ─────────────────────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-sage uppercase tracking-wider">Our Journey</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">Milestones & Growth</h2>
            </div>
            <div className="space-y-6">
              {MILESTONES.map((m, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-forest/10 text-2xl flex items-center justify-center">
                      {m.icon}
                    </div>
                    {i < MILESTONES.length - 1 && <div className="w-0.5 h-8 bg-gray-200 mt-2" />}
                  </div>
                  <div className="pt-2">
                    <p className="text-xs font-bold text-forest uppercase tracking-wider mb-1">{m.year}</p>
                    <p className="text-gray-800 font-medium text-sm leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Technology ───────────────────────────────────────────────────── */}
        <section className="py-20 bg-[#FAF9F6] border-y border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-terracotta uppercase tracking-wider">Under the Hood</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">Built with Modern Technology</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {TECH_STACK.map((tech) => (
                <div key={tech.name} className={`${tech.color} border rounded-2xl p-5 space-y-3`}>
                  <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
                    {tech.icon}
                  </div>
                  <h3 className="font-bold text-gray-900">{tech.name}</h3>
                  <p className="text-xs text-gray-600">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center space-y-6">
            <Leaf className="w-12 h-12 text-forest mx-auto" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Ready to Grow with Us?
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Join 50,000+ plant parents who trust BloomGuard to keep their indoor gardens thriving. It's free to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-forest text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-forest/20 hover:bg-forest/90 hover:scale-[1.02] transition-all"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-800 font-semibold px-8 py-4 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                Browse Plant Catalog
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
