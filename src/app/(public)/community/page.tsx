'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Heart,
  BookOpen,
  Leaf,
  ArrowRight,
  Search,
  Tag,
  ChevronRight,
  Eye,
  Calendar,
  TrendingUp,
  Sprout,
  Star,
  Flower2,
  Users,
  Share2,
  ThumbsUp,
  Bookmark,
  Camera,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import type { User } from '@/types';

// ── Types ─────────────────────────────────────────────────────────────────────
interface BlogPost {
  _id: string;
  id?: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  authorId?: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: string;
  createdAt?: string;
  image?: string;
  tags: string[];
  likes: number;
  views: number;
  featured?: boolean;
}

const FALLBACK_POSTS: BlogPost[] = [
  {
    _id: '1',
    title: 'The Ultimate Monstera Deliciosa Care Guide for 2026',
    excerpt: 'Everything you need to know about growing the most iconic houseplant — from light requirements to propagation techniques and troubleshooting common problems.',
    category: 'Care Guides',
    authorName: 'Dr. Amara Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    authorRole: 'Botanical AI Lead',
    createdAt: '2026-07-20',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    tags: ['Monstera', 'Tropical', 'Beginner Friendly', 'Foliage'],
    likes: 42,
    views: 310,
    featured: true,
  },
  {
    _id: '2',
    title: 'How AI Plant Identification Changed the Way I Care for My Garden',
    excerpt: 'I used to kill every plant I brought home. Then BloomGuard\'s AI scanner identified an obscure humidity issue with my Fiddle Leaf Fig and changed everything.',
    category: 'Community Stories',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    authorRole: 'Urban Jungle Creator',
    createdAt: '2026-07-18',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?auto=format&fit=crop&w=800&q=80',
    tags: ['AI Features', 'Community', 'Success Story'],
    likes: 38,
    views: 245,
    featured: true,
  },
  {
    _id: '3',
    title: '10 Succulents Every Beginner Should Start With',
    excerpt: 'Succulents are forgiving, architectural, and come in extraordinary shapes and colors. Here are the 10 best varieties to build your confidence as a plant parent.',
    category: 'Plant Spotlight',
    authorName: 'Marcus Osei',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    authorRole: 'Chief AI Engineer',
    createdAt: '2026-07-15',
    image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80',
    tags: ['Succulents', 'Beginner', 'Top 10'],
    likes: 29,
    views: 198,
  },
];

const CATEGORIES = ['All', 'Care Guides', 'Plant Spotlight', 'Tips & Tricks', 'Community Stories', 'Advanced Techniques', 'Interior Design'];
const TRENDING_TAGS = ['Monstera', 'Succulents', 'Beginner', 'AI Features', 'Watering', 'Propagation', 'Low Light', 'Pet Friendly'];

function formatLikes(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
}

// ── Post Card ─────────────────────────────────────────────────────────────────
function PostCard({ post, onLike, currentUser }: { post: BlogPost; onLike: (id: string) => void; currentUser: User | null }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  // Dynamically resolve author info: if the post belongs to the currently
  // logged-in user, use their live profile data so it stays up-to-date.
  const isOwn = currentUser && post.authorId && currentUser.id === post.authorId;
  const displayName   = isOwn ? currentUser!.name   : post.authorName;
  const displayAvatar = isOwn ? (currentUser!.avatar ?? post.authorAvatar) : post.authorAvatar;

  const handleLike = () => {
    setLiked((p) => !p);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    onLike(post._id);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={post.image || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-gray-800 backdrop-blur-sm shadow-sm">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-forest/10 text-forest font-semibold">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="font-extrabold text-gray-900 text-base leading-tight line-clamp-2 group-hover:text-forest transition-colors">
          {post.title}
        </h3>

        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-2.5 pt-1">
          <img
            src={displayAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={displayName}
            className="w-7 h-7 rounded-full object-cover ring-2 ring-gray-100"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-800 truncate">
              {displayName}
              {isOwn && (
                <span className="ml-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">You</span>
              )}
            </p>
            <p className="text-[11px] text-gray-400">
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 hover:text-rose-500 transition-colors font-medium ${liked ? 'text-rose-500 font-bold' : ''}`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              {formatLikes(likeCount)}
            </button>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatLikes(post.views || 100)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>(FALLBACK_POSTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New post form state
  const [newTitle, setNewTitle] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newCategory, setNewCategory] = useState('Community Stories');
  const [newTags, setNewTags] = useState('IndoorGarden, Tips');
  const [newImage, setNewImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Fetch posts from MongoDB API
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/community');
      if (res.data?.posts && Array.isArray(res.data.posts)) {
        setPosts(res.data.posts);
      }
    } catch {
      setPosts(FALLBACK_POSTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Like post handler
  const handleLikePost = async (id: string) => {
    try {
      await api.post(`/community/${id}/like`);
    } catch {
      // Local optimistic update already applied
    }
  };

  // Image file picker conversion
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit new post to MongoDB
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newExcerpt.trim()) return;

    setSubmitting(true);
    try {
      const tagArray = newTags.split(',').map((t) => t.trim()).filter(Boolean);
      const res = await api.post('/community', {
        title: newTitle,
        excerpt: newExcerpt,
        category: newCategory,
        image: newImage || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
        tags: tagArray.length ? tagArray : ['Community'],
      });

      if (res.data?.post) {
        setPosts((prev) => [res.data.post, ...prev]);
      }
      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewExcerpt('');
      setNewImage('');
      setToastMsg('Your post has been published to the community!');
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Error creating post.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col font-sans antialiased">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Toast alert */}
        {toastMsg && (
          <div className="fixed top-20 right-5 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span className="text-sm font-semibold">{toastMsg}</span>
          </div>
        )}

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-forest via-emerald-800 to-emerald-900 text-white py-16 sm:py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-sm font-semibold mb-6">
                <Users className="w-4 h-4" />
                Community & Blog
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                Grow Together with the<br />
                <span className="text-emerald-300">BloomGuard Community</span>
              </h1>
              <p className="text-emerald-100 text-lg max-w-2xl leading-relaxed mb-6">
                Discover expert plant care guides, hear success stories from fellow plant parents, and share your own indoor garden journey.
              </p>
              
              {/* Publish button */}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta/90 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg transition-all hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Share Your Story / Write Post
              </button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* ── Main Content ──────────────────────────────────────────── */}
            <div className="flex-1 min-w-0 space-y-8">

              {/* Search & Categories */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search articles, tips, plant names..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest bg-white transition-all"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                        activeCategory === cat
                          ? 'bg-forest text-white border-forest shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-forest hover:text-forest'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Posts */}
              {loading ? (
                <div className="grid sm:grid-cols-2 gap-6 animate-pulse">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-100 rounded-2xl h-72" />
                  ))}
                </div>
              ) : filtered.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {filtered.map((post) => (
                    <PostCard key={post._id} post={post} onLike={handleLikePost} currentUser={user} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center space-y-4">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
                  <h3 className="text-xl font-bold text-gray-900">No community posts found</h3>
                  <button
                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                    className="inline-flex items-center gap-2 bg-forest text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* ── Sidebar ───────────────────────────────────────────────── */}
            <aside className="lg:w-80 space-y-7 flex-shrink-0">
              <div className="bg-gradient-to-br from-forest to-emerald-800 rounded-3xl p-6 text-white space-y-4 shadow-lg">
                <h3 className="font-extrabold text-xl">Share Your Experience</h3>
                <p className="text-emerald-100 text-sm leading-relaxed">
                  Have a plant care discovery or transformation? Publish a post directly to the MongoDB database.
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 text-sm font-bold bg-white text-forest py-3 rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Write New Post
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm space-y-4">
                <h3 className="font-extrabold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-terracotta" />
                  Trending Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 bg-gray-50 text-gray-700 hover:border-forest hover:text-forest transition-all"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* ── Create Post Modal ───────────────────────────────────────────── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Create Community Post</h2>
              <p className="text-xs text-gray-500 mt-1">Share your plant care tips, photos, or questions</p>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. How I Revived My Dying Fern"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest bg-gray-50"
                >
                  <option>Care Guides</option>
                  <option>Community Stories</option>
                  <option>Plant Spotlight</option>
                  <option>Tips & Tricks</option>
                  <option>Advanced Techniques</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">Excerpt / Story</label>
                <textarea
                  required
                  rows={3}
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  placeholder="Short description or main content..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">Post Photo</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="url"
                    value={newImage.startsWith('data:') ? '' : newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Photo URL or choose file below..."
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" /> File
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>
                {newImage && (
                  <div className="mt-2 relative h-32 rounded-xl overflow-hidden bg-gray-100 border">
                    <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Monstera, Propagation, Beginner"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-forest text-white font-bold px-6 py-2 rounded-xl text-xs shadow-md disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
