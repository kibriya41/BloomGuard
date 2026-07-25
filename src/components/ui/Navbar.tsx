'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { Leaf, Menu, X, ArrowRight, UserCheck } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-md py-3 border-b border-gray-100'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-white shadow-md shadow-forest/20 group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 text-emerald-300" />
          </div>
          <span className="font-bold text-xl sm:text-2xl tracking-tight text-gray-900">
            Bloom<span className="text-forest">Guard</span>
          </span>
        </Link>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-700 text-sm lg:text-base">
          <Link href="/" className="hover:text-forest transition-colors">
            Home
          </Link>
          <Link href="/explore" className="hover:text-forest transition-colors">
            Explore
          </Link>
          <Link href="#features" className="hover:text-forest transition-colors">
            About
          </Link>
          <Link href="#community" className="hover:text-forest transition-colors">
            Community
          </Link>
        </div>

        {/* Right: Auth Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/my-garden"
                className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-forest transition-colors px-3 py-2"
              >
                <UserCheck className="w-4 h-4 text-forest" />
                <span>My Garden</span>
              </Link>
              <button
                onClick={logout}
                className="text-sm font-semibold text-gray-600 hover:text-red-600 px-4 py-2 rounded-full border border-gray-200 hover:border-red-200 transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-gray-700 hover:text-forest px-4 py-2 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="group flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full bg-forest text-white hover:bg-forest-hover shadow-lg shadow-forest/20 transition-all hover:scale-[1.02]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-gray-200 px-6 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3 font-medium text-gray-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-forest transition-colors"
            >
              Home
            </Link>
            <Link
              href="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-forest transition-colors"
            >
              Explore
            </Link>
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-forest transition-colors"
            >
              About
            </Link>
            <Link
              href="#community"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-forest transition-colors"
            >
              Community
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
            {user ? (
              <>
                <Link
                  href="/my-garden"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-forest text-white font-semibold"
                >
                  My Garden
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 rounded-full border border-gray-300 text-gray-700 font-semibold"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full border border-gray-300 font-semibold text-gray-800 hover:bg-gray-50"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-forest text-white font-semibold hover:bg-forest-hover shadow-md"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
