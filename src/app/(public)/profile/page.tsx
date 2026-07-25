'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  User,
  Camera,
  Upload,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Leaf,
  Flower2,
  Sprout,
  Shield,
  Mail,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { useAuth } from '@/lib/authContext';
import { api } from '@/lib/api';

function ProfileContent() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [gardenStats, setGardenStats] = useState({ total: 0, healthy: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatar(user.avatar || '');
    }
  }, [user]);

  // Fetch garden stats for profile overview
  useEffect(() => {
    api.get('/my-garden')
      .then((res) => {
        if (res.data?.plants && Array.isArray(res.data.plants)) {
          const total = res.data.plants.length;
          const healthy = res.data.plants.filter((p: any) => p.healthStatus === 'Healthy').length;
          setGardenStats({ total, healthy });
        }
      })
      .catch(() => {});
  }, []);

  // Handle local image file upload & convert to base64
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatar(base64String);
    };
    reader.readAsDataURL(file);
  };

  // Submit profile updates to MongoDB backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await api.put('/auth/profile', { name, avatar });
      const updatedData = res.data.user;
      
      // Update global Auth Context
      updateUser({
        name: updatedData.name,
        avatar: updatedData.avatar,
      });

      setSuccessMsg('Profile updated successfully and saved to MongoDB!');
    } catch (err: any) {
      // Local update fallback if offline
      updateUser({ name, avatar });
      setSuccessMsg('Profile updated locally!');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl space-y-10">

      {/* Header */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/10 text-forest text-xs font-semibold mb-3">
          <User className="w-3.5 h-3.5" />
          Account Profile
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          User Settings & Avatar
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1">
          Manage your personal details, profile picture, and view your indoor garden stats.
        </p>
      </div>

      {/* Main Profile Form */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar Upload Card */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm text-center space-y-5">
          <h2 className="font-extrabold text-gray-900 text-base">Profile Photo</h2>

          {/* Avatar Preview Circle */}
          <div className="relative w-36 h-36 rounded-full overflow-hidden mx-auto ring-4 ring-forest/20 shadow-md group">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-forest text-white flex items-center justify-center text-3xl font-extrabold">
                {name ? name.slice(0, 2).toUpperCase() : 'U'}
              </div>
            )}
            
            {/* Hover overlay button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer"
            >
              <Camera className="w-6 h-6" />
              <span className="text-[11px] font-bold">Change Photo</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
            className="hidden"
          />

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border border-gray-200 hover:border-forest text-gray-700 hover:text-forest transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Image File
            </button>
            <p className="text-[11px] text-gray-400">JPG, PNG or GIF up to 5MB</p>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-2 text-left text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Role</span>
              <span className="font-bold text-forest uppercase bg-forest/10 px-2 py-0.5 rounded-full text-[10px]">
                {user?.role || 'User'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Status</span>
              <span className="font-bold text-emerald-600">Active Parent</span>
            </div>
          </div>
        </div>

        {/* Right Column: User Details Form */}
        <div className="md:col-span-2 space-y-6">

          {/* Feedback Alerts */}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="font-extrabold text-gray-900 text-lg">Personal Information</h2>

            {/* Display Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest bg-gray-50 font-medium"
                placeholder="Your full name"
              />
            </div>

            {/* Email Address (Read-only) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-100 text-gray-500 font-medium cursor-not-allowed"
              />
              <p className="text-[11px] text-gray-400">Email address cannot be modified</p>
            </div>

            {/* Image URL Input (Alternative option) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-gray-400" />
                Avatar Image URL (Optional)
              </label>
              <input
                type="url"
                value={avatar.startsWith('data:') ? '' : avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest bg-gray-50"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">Changes will be saved directly to MongoDB</span>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-forest hover:bg-forest/90 text-white font-bold px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all text-sm disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Garden Overview Card */}
          <div className="bg-gradient-to-r from-forest to-emerald-800 rounded-3xl p-6 text-white flex items-center justify-between shadow-md">
            <div className="space-y-1">
              <p className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Garden Summary</p>
              <h3 className="text-xl font-extrabold">{gardenStats.total} Plants Collection</h3>
              <p className="text-emerald-100 text-xs">{gardenStats.healthy} plants in healthy status</p>
            </div>
            <Link
              href="/my-garden"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-forest px-4 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm"
            >
              My Garden <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col font-sans antialiased">
      <Navbar />
      <main className="flex-1 pt-16">
        <ProtectedRoute featureName="User Profile" message="Log in to view and update your user profile picture and account settings.">
          <ProfileContent />
        </ProtectedRoute>
      </main>
      <Footer />
    </div>
  );
}
