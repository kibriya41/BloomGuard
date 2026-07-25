'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  Leaf,
  Menu,
  X,
  ArrowRight,
  Bot,
  Calendar,
  Sprout,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Flower2,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/care-planner', label: 'Care Planner' },
  { href: '/ai-assistant', label: 'AI Assistant' },
  { href: '/community', label: 'Community' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-gray-100'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center text-white shadow-md shadow-forest/20 group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 text-emerald-300" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">
            Bloom<span className="text-forest">Guard</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1 font-medium text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-xl transition-all ${
                isActive(link.href)
                  ? 'text-forest bg-forest/10 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right: Auth & User Menu */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              {/* Garden shortcut */}
              <Link
                href="/my-garden"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-forest px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Flower2 className="w-4 h-4 text-forest" />
                My Garden
              </Link>

              {/* User Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((p) => !p)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  {/* Avatar */}
                  {user.avatar ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-forest/20">
                      <Image src={user.avatar} alt={user.name} fill sizes="32px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center text-xs font-bold ring-2 ring-forest/20">
                      {userInitials}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{user.name.split(' ')[0]}</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200/80 overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                    {/* User Header */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="font-bold text-gray-900 text-sm truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {[
                        { href: '/profile', icon: <User className="w-4 h-4" />, label: 'Profile Settings' },
                        { href: '/my-garden', icon: <Flower2 className="w-4 h-4" />, label: 'My Garden' },
                        { href: '/plants/add', icon: <Sprout className="w-4 h-4" />, label: 'Add Plant' },
                        { href: '/plants/manage', icon: <Settings className="w-4 h-4" />, label: 'Manage Plants' },
                        { href: '/care-planner', icon: <Calendar className="w-4 h-4" />, label: 'Care Planner' },
                        { href: '/ai-assistant', icon: <Bot className="w-4 h-4" />, label: 'AI Assistant' },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-forest/5 hover:text-forest transition-colors"
                        >
                          <span className="text-gray-400">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                className="group flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full bg-forest text-white hover:bg-forest/90 shadow-lg shadow-forest/20 transition-all hover:scale-[1.02]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-lg border-b border-gray-200 px-5 pt-4 pb-6 shadow-xl space-y-1">

          {/* Nav Links */}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center py-3 px-3 rounded-xl font-medium text-sm transition-colors ${
                isActive(link.href)
                  ? 'text-forest bg-forest/10 font-semibold'
                  : 'text-gray-700 hover:text-forest hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-4 border-t border-gray-100 space-y-2">
            {user ? (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-xl mb-3">
                  {user.avatar ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-forest/20">
                      <Image src={user.avatar} alt={user.name} fill sizes="40px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center text-sm font-bold">
                      {userInitials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>

                {[
                  { href: '/my-garden', label: 'My Garden' },
                  { href: '/plants/manage', label: 'Manage Plants' },
                  { href: '/plants/add', label: 'Add New Plant' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 rounded-xl border border-gray-200 text-gray-800 font-semibold text-sm hover:bg-gray-50"
                  >
                    {item.label}
                  </Link>
                ))}

                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full text-center py-2.5 rounded-xl border border-rose-200 text-rose-600 font-semibold text-sm hover:bg-rose-50"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-800 text-sm hover:bg-gray-50"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 rounded-xl bg-forest text-white font-semibold text-sm hover:bg-forest/90 shadow-md"
                >
                  Get Started — Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
