'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  Camera,
  Droplets,
  Bell,
  ShieldAlert,
  Bot,
  Sun,
  CheckCircle2,
  Send,
  Leaf,
  Users,
  Award,
  Heart,
  Calendar,
} from 'lucide-react';
import FeatureCard from '@/components/ui/FeatureCard';
import PlantCard, { PlantCardProps } from '@/components/ui/PlantCard';
import TestimonialCard from '@/components/ui/TestimonialCard';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';

const POPULAR_PLANTS: PlantCardProps[] = [
  {
    id: 'monstera-deliciosa',
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    category: 'Foliage',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    waterNeed: 'Every 1-2 weeks',
    lightNeed: 'Bright indirect',
    difficulty: 'Easy',
  },
  {
    id: 'snake-plant',
    name: 'Snake Plant',
    scientificName: 'Dracaena trifasciata',
    category: 'Succulent',
    image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bac?auto=format&fit=crop&w=800&q=80',
    waterNeed: 'Every 2-3 weeks',
    lightNeed: 'Low to bright',
    difficulty: 'Easy',
  },
  {
    id: 'peace-lily',
    name: 'Peace Lily',
    scientificName: 'Spathiphyllum wallisii',
    category: 'Flowering',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=800&q=80',
    waterNeed: 'Weekly',
    lightNeed: 'Medium shade',
    difficulty: 'Moderate',
  },
  {
    id: 'fiddle-leaf-fig',
    name: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    category: 'Tree',
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    waterNeed: 'Every 7-10 days',
    lightNeed: 'Bright direct',
    difficulty: 'Advanced',
  },
];

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6]">
      {/* Navigation Bar */}
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-b from-[#F0F4F1] via-[#F0F4F1]/60 to-[#FAF9F6]">
        {/* Background Subtle Blobs */}
        <div className="absolute top-10 right-0 -mr-20 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 text-forest" />
                <span>Next-Gen Agentic Plant Care</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
                Nurture Your <br />
                <span className="text-forest underline decoration-emerald-300 decoration-wavy underline-offset-8">
                  Indoor Jungle
                </span>{' '}
                With AI
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-xl leading-relaxed">
                BloomGuard combines computer vision and botanical science to identify plant species, diagnose disease symptoms early, and automate customized watering schedules.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/register"
                  className="group flex items-center gap-2 px-8 py-4 rounded-full bg-forest text-white font-bold text-base shadow-xl shadow-forest/20 hover:bg-forest-hover hover:scale-[1.02] transition-all"
                >
                  <span>Start Your Garden</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/explore"
                  className="px-8 py-4 rounded-full bg-white text-gray-800 font-bold text-base border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-forest/30 transition-all"
                >
                  Explore Plants
                </Link>
              </div>

              {/* Social Proof Badges */}
              <div className="pt-8 border-t border-gray-200/80 flex items-center gap-6 text-xs sm:text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Instant AI Diagnostics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Free Forever Tier</span>
                </div>
              </div>
            </div>

            {/* Right Hero Interactive Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                {/* Top Badge */}
                <div className="absolute -top-3 -right-3 px-4 py-1.5 rounded-full bg-terracotta text-white text-xs font-bold shadow-lg flex items-center gap-1.5">
                  <Bot className="w-4 h-4" />
                  <span>AI Guardian Active</span>
                </div>

                <div className="relative h-64 rounded-2xl overflow-hidden mb-5 bg-gray-100">
                  <Image
                    src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80"
                    alt="Monstera Deliciosa Preview"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-forest" />
                    <span>Identified in 0.4s</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Monstera Deliciosa</h3>
                      <p className="text-xs text-gray-500">Living Room Window • 85% Health Score</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      Thriving
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                      <div className="p-2 bg-emerald-500 text-white rounded-lg">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Watering</p>
                        <p className="text-xs font-bold text-gray-800">Due Tomorrow</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-3">
                      <div className="p-2 bg-amber-500 text-white rounded-lg">
                        <Sun className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Sunlight</p>
                        <p className="text-xs font-bold text-gray-800">Bright Indirect</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section id="features" className="py-24 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-forest">
              Smart Botanical Intelligence
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Everything Your Plants Need to Flourish
            </p>
            <p className="text-gray-600 text-base sm:text-lg">
              BloomGuard blends computer vision, environmental data, and care automation into one intuitive companion.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Camera className="w-7 h-7" />}
              title="Instant AI Plant Identification"
              description="Snap a photo of any houseplant to recognize over 10,000+ species with detailed care profiles in seconds."
              badge="99% Accuracy"
            />
            <FeatureCard
              icon={<ShieldAlert className="w-7 h-7" />}
              title="Early Disease Diagnosis"
              description="Detect leaf discoloration, root rot symptoms, and pest infestations early with targeted remedy recommendations."
              badge="AI Health Scanner"
            />
            <FeatureCard
              icon={<Droplets className="w-7 h-7" />}
              title="Smart Watering Calculator"
              description="Adaptive moisture calculations tailored to your plant's pot size, soil type, and regional weather forecast."
            />
            <FeatureCard
              icon={<Bell className="w-7 h-7" />}
              title="Automated Care Reminders"
              description="Never forget to water, mist, rotate, or fertilize again. Get gentle mobile notifications right when needed."
            />
            <FeatureCard
              icon={<Bot className="w-7 h-7" />}
              title="24/7 Botanical AI Assistant"
              description="Have questions about repotting or yellow leaves? Chat anytime with our trained plant expert assistant."
            />
            <FeatureCard
              icon={<Calendar className="w-7 h-7" />}
              title="Personal Digital Garden"
              description="Log care milestones, monitor growth photo timelines, and organize your plants room-by-room."
            />
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-24 bg-[#FAF9F6]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-terracotta uppercase tracking-wider">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              How BloomGuard Works
            </h2>
            <p className="text-gray-600">
              From identification to long-term care, getting started takes less than 2 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-forest text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-forest/20">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900">Snap & Identify</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Take a quick photo of your plant or upload an image. Our AI identifies the species instantly and assigns it to your digital garden.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-terracotta text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-terracotta/20">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900">Get Custom Schedule</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                BloomGuard analyzes your plant's lighting, humidity, and pot size to generate a tailored watering and fertilization timeline.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sage text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-sage/20">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900">Watch It Flourish</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Receive timely care alerts, diagnose health issues instantly, and track growth progress as your indoor garden thrives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Popular Plants Section */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-forest uppercase tracking-wider">
                Explore Species
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
                Popular Houseplants
              </h2>
            </div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 font-bold text-forest hover:text-forest-hover transition-colors"
            >
              <span>Browse Full Botanical Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {POPULAR_PLANTS.map((plant) => (
              <PlantCard key={plant.id} {...plant} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Stats / Benefits Section */}
      <section className="py-20 bg-forest text-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl font-black text-emerald-300">50K+</p>
              <p className="text-sm font-medium text-emerald-100">Active Plant Parents</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl font-black text-emerald-300">98%</p>
              <p className="text-sm font-medium text-emerald-100">Plant Survival Rate</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl font-black text-emerald-300">10,000+</p>
              <p className="text-sm font-medium text-emerald-100">Species Database</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl font-black text-emerald-300">4.9★</p>
              <p className="text-sm font-medium text-emerald-100">User Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section id="community" className="py-24 bg-[#FAF9F6]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-forest uppercase tracking-wider">
              Loved by Plant Enthusiasts
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Community Stories
            </h2>
            <p className="text-gray-600">
              See how BloomGuard helped beginners turn brown thumbs into lush green paradises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="BloomGuard saved my Fiddle Leaf Fig! The AI scanner diagnosed spider mites before I could even see them with my naked eye. Truly a lifesaver."
              author="Elena Rostova"
              role="Urban Jungle Creator (42 Plants)"
              avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              rating={5}
            />
            <TestimonialCard
              quote="I used to overwater every single plant I bought. The automated moisture reminders changed everything. My apartment looks like a botanical garden now."
              author="Marcus Chen"
              role="Apartment Gardener"
              avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
              rating={5}
            />
            <TestimonialCard
              quote="The AI Assistant gives advice that is so practical and instant. It’s like having a botanist living in your phone."
              author="Sophia Taylor"
              role="Interior Plant Stylist"
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* 7. Final CTA + Newsletter */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-forest to-emerald-900 p-8 sm:p-14 text-white text-center shadow-2xl relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <Leaf className="w-12 h-12 text-emerald-300 mx-auto" />
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Ready to Become a Thriving Plant Parent?
              </h2>
              <p className="text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto">
                Join BloomGuard today. Start identifying plants, setting up automated care reminders, and receiving expert AI tips for free.
              </p>

              <div className="pt-4 flex justify-center">
                <Link
                  href="/register"
                  className="px-8 py-4 rounded-full bg-white text-forest font-extrabold text-lg hover:bg-emerald-50 transition-all shadow-xl hover:scale-105"
                >
                  Create Your Free Account
                </Link>
              </div>

              {/* Newsletter Form */}
              <div className="pt-10 border-t border-emerald-800/80 max-w-md mx-auto">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200 mb-3">
                  Subscribe to Weekly Botanical Tips
                </p>
                {subscribed ? (
                  <div className="p-3 bg-emerald-800/60 rounded-xl text-emerald-200 text-sm font-medium">
                    ✓ Thank you! You're subscribed to BloomGuard Botanical Digest.
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="flex-1 px-4 py-3 rounded-full bg-emerald-950/60 border border-emerald-700/60 text-white placeholder-emerald-300/60 text-sm focus:outline-none focus:border-emerald-300"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-full bg-terracotta text-white font-bold text-sm hover:bg-orange-700 transition-colors shadow-md flex items-center gap-1.5"
                    >
                      <span>Join</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
