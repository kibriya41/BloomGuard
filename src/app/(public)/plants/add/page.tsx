'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
  UploadCloud,
  Check,
  Leaf,
  Droplets,
  Calendar,
  MapPin,
  Ruler,
  FileText,
  HeartPulse,
  Loader2,
  AlertCircle,
  ImageIcon,
} from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/authContext';

// ── Zod Validation Schema ──────────────────────────────────────────────────────
const addPlantSchema = z.object({
  customName: z
    .string()
    .min(2, { message: 'Common name must be at least 2 characters' })
    .max(50, { message: 'Name is too long' }),
  scientificName: z.string().optional(),
  category: z.string().min(1, { message: 'Please select a plant category' }),
  purchaseDate: z.string().optional(),
  location: z.string().min(1, { message: 'Please specify a location in your home' }),
  currentHeightCm: z.preprocess(
    (val) => (val === '' || val === undefined || isNaN(Number(val)) ? undefined : Number(val)),
    z.number().min(0, { message: 'Height must be a positive number' }).optional()
  ),
  healthStatus: z.enum(['Healthy', 'Needs Attention', 'Critical']),
  wateringFrequencyDays: z.preprocess(
    (val) => (val === '' || val === undefined || isNaN(Number(val)) ? 7 : Number(val)),
    z.number().min(1, { message: 'Watering frequency must be at least 1 day' }).max(60, { message: 'Max 60 days' })
  ),
  notes: z.string().optional(),
});

type AddPlantFormData = z.infer<typeof addPlantSchema>;

const PRESET_PLANT_IMAGES = [
  'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1585687433141-f1e3f9065f7a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1572688484438-313a6e50c333?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
];

export default function AddPlantPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addPlantSchema),
    defaultValues: {
      customName: '',
      scientificName: '',
      category: 'Foliage',
      purchaseDate: new Date().toISOString().split('T')[0],
      location: 'Living Room',
      currentHeightCm: undefined,
      healthStatus: 'Healthy',
      wateringFrequencyDays: 7,
      notes: '',
    },
  });

  // ── AI Auto-fill Simulation ─────────────────────────────────────────────────
  const handleAiAutoFill = () => {
    setAiAnalyzing(true);
    setAiSuccess(false);
    setTimeout(() => {
      setValue('customName', 'Fiddle Leaf Fig', { shouldValidate: true });
      setValue('scientificName', 'Ficus lyrata', { shouldValidate: true });
      setValue('category', 'Foliage', { shouldValidate: true });
      setValue('location', 'Living Room (East Window)', { shouldValidate: true });
      setValue('currentHeightCm', 65, { shouldValidate: true });
      setValue('wateringFrequencyDays', 9, { shouldValidate: true });
      setValue('healthStatus', 'Healthy', { shouldValidate: true });
      setValue(
        'notes',
        'Foliage identified via AI vision scan. Broad violin-shaped glossy leaves. Prefers bright indirect light and warm room temperatures.'
      );
      if (images.length === 0) {
        setImages(['https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80']);
      }
      setAiAnalyzing(false);
      setAiSuccess(true);
    }, 1400);
  };

  // ── Image Handlers ─────────────────────────────────────────────────────────
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (images.includes(imageUrlInput.trim())) return;
    setImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectPresetImage = (url: string) => {
    if (!images.includes(url)) {
      setImages((prev) => [...prev, url]);
    }
  };

  // ── Submit Handler ─────────────────────────────────────────────────────────
  const onSubmit = async (data: AddPlantFormData) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/my-garden', {
        customName: data.customName,
        scientificName: data.scientificName || undefined,
        category: data.category,
        purchaseDate: data.purchaseDate || undefined,
        location: data.location,
        currentHeightCm: data.currentHeightCm,
        healthStatus: data.healthStatus,
        wateringFrequencyDays: data.wateringFrequencyDays,
        notes: data.notes,
        images: images.length > 0 ? images : [PRESET_PLANT_IMAGES[0]],
      });

      router.push('/my-garden');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to add plant to your garden. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50/60 via-white to-emerald-50/40">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link
              href="/my-garden"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#166534] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to My Garden</span>
            </Link>
          </div>

          {/* Page Header */}
          <div className="mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
              <Leaf className="w-3.5 h-3.5" />
              Garden Registry
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Add New <span className="text-[#166534]">Plant</span>
            </h1>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              Register a new plant in your personal garden to track watering, monitor health, and receive automated botanical care tips.
            </p>
          </div>

          {/* AI Banner Callout */}
          <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-[#166534] to-[#4F7668] text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  BloomGuard AI Vision
                </div>
                <h3 className="text-lg font-bold">AI Auto-fill from Photo</h3>
                <p className="text-xs text-white/80 max-w-lg leading-relaxed">
                  Let our AI identify your plant species, botanical name, care requirements, and health parameters automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAiAutoFill}
                disabled={aiAnalyzing}
                className="flex-shrink-0 flex items-center gap-2 py-3 px-6 rounded-2xl bg-white text-[#166534] font-bold text-sm shadow-md hover:bg-green-50 transition-all active:scale-95 disabled:opacity-80"
              >
                {aiAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#166534]" />
                    <span>Analyzing Foliage...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#C2410C]" />
                    <span>AI Auto-fill Form</span>
                  </>
                )}
              </button>
            </div>

            {aiSuccess && (
              <div className="mt-4 pt-3 border-t border-white/20 text-xs font-semibold text-emerald-200 flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-300" />
                <span>AI identification complete! Plant details & care specs auto-filled below.</span>
              </div>
            )}
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-10 shadow-sm space-y-8"
          >
            {/* 1. Basic Plant Information */}
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-[#166534]" />
                  Basic Plant Identification
                </h2>
                <p className="text-xs text-gray-500">Provide common name, botanical classification, and category.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Common Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Common Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Monstera, Fiddle Leaf Fig"
                    {...register('customName')}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                      errors.customName
                        ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/30'
                        : 'border-gray-200 focus:ring-[#166534] focus:border-transparent'
                    }`}
                  />
                  {errors.customName && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.customName.message}
                    </p>
                  )}
                </div>

                {/* Scientific Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Scientific / Botanical Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Monstera deliciosa"
                    {...register('scientificName')}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent italic"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Plant Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent cursor-pointer"
                  >
                    <option value="Foliage">🌿 Foliage (Monstera, Pothos, Philodendron)</option>
                    <option value="Succulent">🌵 Succulent (Aloe, Snake Plant, Echeveria)</option>
                    <option value="Flowering">🌸 Flowering (Peace Lily, Orchid, Anthurium)</option>
                    <option value="Fern">🪴 Fern (Boston Fern, Bird's Nest)</option>
                    <option value="Palm">🌴 Palm (Parlor Palm, Areca)</option>
                    <option value="Cacti">🌵 Cacti (Bunny Ears, Saguaro)</option>
                    <option value="Herb">🌱 Herb (Basil, Mint, Rosemary)</option>
                    <option value="Other">🍃 Other Species</option>
                  </select>
                  {errors.category && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Image Upload & Gallery */}
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#C2410C]" />
                  Plant Photo & Gallery
                </h2>
                <p className="text-xs text-gray-500">Upload or add image URLs for your plant profile.</p>
              </div>

              {/* Image previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((url, idx) => (
                    <div key={idx} className="relative h-32 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group">
                      <Image src={url} alt={`Plant preview ${idx + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-gray-600 hover:text-rose-600 hover:bg-white shadow transition-all"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-sm">
                          Cover Photo
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add Image URL Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="url"
                    placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#166534]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm transition-all"
                >
                  Add Photo
                </button>
              </div>

              {/* Quick Preset Selector */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Or select sample photo:</p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {PRESET_PLANT_IMAGES.map((url, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => handleSelectPresetImage(url)}
                      className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-transparent hover:border-[#166534] flex-shrink-0 transition-all"
                    >
                      <Image src={url} alt={`Preset ${i + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Location & Care Parameters */}
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#4F7668]" />
                  Location & Routine Care
                </h2>
                <p className="text-xs text-gray-500">Set home placement and watering schedule frequency.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Location in Home */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Location in Home <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Living Room, Bedroom Shelf, Balcony"
                    {...register('location')}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                      errors.location
                        ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/30'
                        : 'border-gray-200 focus:ring-[#166534] focus:border-transparent'
                    }`}
                  />
                  {errors.location && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.location.message}
                    </p>
                  )}
                </div>

                {/* Purchase Date */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Acquisition / Purchase Date
                  </label>
                  <input
                    type="date"
                    {...register('purchaseDate')}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#166534] cursor-pointer"
                  />
                </div>

                {/* Height (cm) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5 text-gray-400" />
                    Current Height (cm)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 45"
                    {...register('currentHeightCm')}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#166534]"
                  />
                  {errors.currentHeightCm && (
                    <p className="text-xs text-rose-500 mt-1">{errors.currentHeightCm.message}</p>
                  )}
                </div>

                {/* Watering Frequency Days */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    Watering Schedule (Every N Days)
                  </label>
                  <input
                    type="number"
                    placeholder="7"
                    {...register('wateringFrequencyDays')}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#166534]"
                  />
                  {errors.wateringFrequencyDays && (
                    <p className="text-xs text-rose-500 mt-1">{errors.wateringFrequencyDays.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Health & Notes */}
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-[#C2410C]" />
                  Current Health & Botanical Notes
                </h2>
                <p className="text-xs text-gray-500">Record initial health status and custom care observations.</p>
              </div>

              <div className="space-y-6">
                {/* Health Status */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Initial Health Status <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'Healthy', label: 'Healthy 🟢', desc: 'Lush & thriving' },
                      { value: 'Needs Attention', label: 'Needs Care 🟡', desc: 'Drooping/pale' },
                      { value: 'Critical', label: 'Critical 🔴', desc: 'Root rot / distress' },
                    ].map((status) => (
                      <label
                        key={status.value}
                        className="relative border rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer hover:border-[#166534] transition-all has-[:checked]:border-[#166534] has-[:checked]:bg-green-50/50"
                      >
                        <input
                          type="radio"
                          value={status.value}
                          {...register('healthStatus')}
                          className="sr-only"
                        />
                        <span className="text-sm font-bold text-gray-800">{status.label}</span>
                        <span className="text-[11px] text-gray-500 text-center">{status.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                    Notes & Observations
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Add light preferences, soil mixture notes, or pruning logs..."
                    {...register('notes')}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#166534] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-3">
              <Link
                href="/my-garden"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 text-center transition-all"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#166534] hover:bg-[#14532d] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-75"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Adding to Garden...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add Plant</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
