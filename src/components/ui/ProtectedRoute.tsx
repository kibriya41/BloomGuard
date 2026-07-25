'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, Leaf, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Custom message shown to unauthenticated users */
  message?: string;
  /** Feature name shown in the prompt (e.g. "My Garden", "Care Planner") */
  featureName?: string;
}

/**
 * Wraps a page section in an auth check.
 * If the user is not logged in, shows a beautiful login prompt instead of the content.
 * Does NOT redirect — keeps UX smooth and non-jarring.
 */
export default function ProtectedRoute({
  children,
  message = 'Please log in to access this feature.',
  featureName = 'this feature',
}: ProtectedRouteProps) {
  const { user, loading, demoLogin } = useAuth();
  const [demoing, setDemoing] = React.useState(false);

  // Still loading auth state — show a spinner
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full border-4 border-forest border-t-transparent animate-spin mx-auto" />
          <p className="text-gray-500 font-medium text-sm">Loading your account...</p>
        </div>
      </div>
    );
  }

  // Authenticated — render normally
  if (user) {
    return <>{children}</>;
  }

  // Not authenticated — show login prompt
  const handleDemoLogin = async () => {
    setDemoing(true);
    await demoLogin();
    setDemoing(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#FBFBFA]">
      <div className="max-w-md w-full text-center space-y-7">
        {/* Icon */}
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-3xl bg-forest/10 text-forest flex items-center justify-center mx-auto border border-forest/20">
            <Leaf className="w-12 h-12" />
          </div>
          <div className="absolute -top-2 -right-2 w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-sm">
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-extrabold text-gray-900">
            Sign In to Access {featureName}
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest/90 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-forest/20 transition-all hover:scale-[1.02]"
          >
            Log In to BloomGuard
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Demo Login */}
          <button
            onClick={handleDemoLogin}
            disabled={demoing}
            className="inline-flex items-center justify-center gap-2 border border-terracotta/40 bg-terracotta/5 hover:bg-terracotta/10 text-terracotta font-semibold px-6 py-3.5 rounded-2xl transition-all text-sm disabled:opacity-60"
          >
            {demoing ? (
              <>
                <div className="w-4 h-4 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
                <span>Entering Demo Mode...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Try Demo — No Account Needed</span>
              </>
            )}
          </button>

          <Link
            href="/register"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors py-1"
          >
            Don't have an account?{' '}
            <span className="font-semibold text-forest hover:underline">Sign up free</span>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 text-left space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">What you'll get</p>
          {[
            'Personalized care schedule for your plants',
            'AI health diagnostics and alerts',
            'Track watering, fertilizing, and growth',
            'Context-aware botanical AI assistant',
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-2.5 text-sm text-gray-700">
              <div className="w-5 h-5 rounded-full bg-forest/10 text-forest flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {benefit}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
