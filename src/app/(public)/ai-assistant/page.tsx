'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Leaf,
  Droplets,
  Sun,
  Camera,
  Sprout,
  Plus,
  ChevronRight,
  Loader2,
  RefreshCw,
  RotateCcw,
  MessageCircle,
  Clock,
} from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/authContext';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface GardenPlant {
  _id: string;
  customName: string;
  healthStatus: string;
  category: string;
  images: string[];
}

// ── Quick Suggestion Chips ────────────────────────────────────────────────────
const QUICK_SUGGESTIONS = [
  'Why are my plant leaves turning yellow? 🍃',
  'How often should I water a Monstera?',
  'What plants are best for low light rooms?',
  'How do I treat spider mites on my plants?',
  'When should I repot my plant?',
  'What fertilizer should I use for tropical plants?',
];

// ── Smart Local Fallback Responses ────────────────────────────────────────────
function getLocalFallbackReply(message: string, gardenContext: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('water') || lower.includes('drench') || lower.includes('mist')) {
    return `For most indoor plants, water when the top 1–2 inches of soil feel dry 💧. Succulents need to dry out completely, while tropical foliage like Monstera prefers consistently moist (not wet) soil. ${gardenContext ? `In your garden, pay special attention to plants in warmer, brighter spots — they'll need more frequent watering.` : ''}`;
  }
  if (lower.includes('yellow') || lower.includes('brown') || lower.includes('drooping')) {
    return `Yellow leaves are usually a sign of overwatering (most common!) or insufficient light 🌿. Feel the soil — if it's soggy, let it dry completely before watering again. Brown tips often indicate low humidity or tap water minerals. Try switching to filtered water and misting the leaves every few days.`;
  }
  if (lower.includes('light') || lower.includes('sun') || lower.includes('window')) {
    return `Most indoor plants thrive in bright, indirect light near an east or north-facing window ☀️. South-facing windows provide the most intense light, which suits cacti and succulents. If your plant is leggy or leaning toward the window, it needs more light. Rotate it 90° weekly for even growth!`;
  }
  if (lower.includes('fertilize') || lower.includes('feed') || lower.includes('nutrient')) {
    return `Use a balanced liquid fertilizer (like 10-10-10 NPK) diluted to half strength during spring and summer 🌱. Skip fertilizing in autumn and winter — plants rest during this period and over-fertilizing causes salt buildup that damages roots. Always fertilize after watering to avoid burning dry roots.`;
  }
  if (lower.includes('pest') || lower.includes('bug') || lower.includes('spider') || lower.includes('mite')) {
    return `For spider mites, fungus gnats, or mealybugs, neem oil spray is your best organic solution 🔍. Mix 2 tbsp neem oil + 1 tsp dish soap per liter of water. Spray all leaf surfaces — top and bottom — and repeat weekly for 3–4 weeks. Isolate affected plants immediately to prevent spreading!`;
  }
  if (lower.includes('repot') || lower.includes('pot') || lower.includes('soil') || lower.includes('root')) {
    return `Repot when you see roots growing out of drainage holes or when soil dries out within 1–2 days 🪴. Spring is the best time — choose a pot only 1–2 inches larger. Fresh, well-draining potting mix with perlite gives roots the oxygen and drainage they need. Water lightly after repotting and keep out of direct sun for a week.`;
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return `Hello! 🌿 I'm your BloomGuard AI assistant — here to help all your plants thrive! I can answer questions about plant care, diagnose common issues, recommend the best plants for your space, and give tailored advice for your garden. What would you like to know today?`;
  }
  return `Great question about plant care! 🌱 The key is to always observe your plants closely — changes in leaf color, texture, and posture tell you exactly what they need. For specific guidance, I'd recommend checking the watering schedule in your Care Planner and consulting the plant's detail page for precise care instructions. Is there a specific symptom or plant you'd like me to help with?`;
}

// ── Chat Message Bubble ───────────────────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const timeStr = message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-5`}>
      {/* Avatar */}
      <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm ${isUser ? 'bg-terracotta text-white' : 'bg-forest text-white'}`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%] sm:max-w-[70%]`}>
        {/* Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isUser
              ? 'bg-terracotta text-white rounded-tr-sm'
              : 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-sm'
          }`}
        >
          {message.content}
        </div>
        {/* Timestamp */}
        <span className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeStr}
        </span>
      </div>
    </div>
  );
}

// ── Typing Indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-forest text-white flex items-center justify-center shadow-sm flex-shrink-0">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-white border border-gray-200/80 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-forest/40 animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-forest/40 animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-forest/40 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export default function AIAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [gardenPlants, setGardenPlants] = useState<GardenPlant[]>([]);
  const [gardenLoading, setGardenLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch user garden context
  useEffect(() => {
    if (!user) return;
    setGardenLoading(true);
    api.get('/my-garden')
      .then((res) => {
        if (res.data?.plants) {
          setGardenPlants(
            res.data.plants.slice(0, 8).map((p: any) => ({
              _id: p._id,
              customName: p.customName || 'Unnamed Plant',
              healthStatus: p.healthStatus || 'Healthy',
              category: p.category || 'Foliage',
              images: p.images || [],
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setGardenLoading(false));
  }, [user]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const sendMessage = useCallback(async (messageText?: string) => {
    const text = (messageText ?? input).trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const historyForAPI = messages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await api.post('/ai/chat', {
        message: text,
        history: historyForAPI,
      });

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.data.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Local fallback
      const gardenContext = gardenPlants.map((p) => p.customName).join(', ');
      const fallbackReply = getLocalFallbackReply(text, gardenContext);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [input, messages, gardenPlants]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const healthColor = (status: string) => {
    if (status === 'Healthy') return 'bg-emerald-100 text-emerald-700';
    if (status === 'Critical') return 'bg-rose-100 text-rose-700';
    if (status === 'Needs Attention') return 'bg-amber-100 text-amber-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col font-sans antialiased">
      <Navbar />

      <main className="flex-1 flex flex-col pt-16">
        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-forest to-emerald-800 text-white px-4 sm:px-6 lg:px-8 py-8 border-b border-emerald-900/30">
          <div className="container mx-auto max-w-7xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <Bot className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold">BloomGuard AI Assistant</h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-400/20 border border-emerald-400/30 text-emerald-200 rounded-full uppercase tracking-wide">
                    Online
                  </span>
                </div>
                <p className="text-emerald-200 text-sm">
                  Context-aware botanical expert — knows your garden 🌿
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  title="Clear chat"
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setSidebarOpen((p) => !p)}
                className="md:hidden p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
              >
                <Leaf className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Main Layout ──────────────────────────────────────────────────── */}
        <div className="flex-1 flex container mx-auto max-w-7xl w-full overflow-hidden">

          {/* ── Chat Area ─────────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col min-h-0">

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6" style={{ maxHeight: 'calc(100vh - 300px)', minHeight: '400px' }}>
              {messages.length === 0 ? (
                /* Welcome Screen */
                <div className="max-w-2xl mx-auto py-8 space-y-8">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-forest/10 text-forest flex items-center justify-center mx-auto border border-forest/20">
                      <Sparkles className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900">
                      Hello{user ? `, ${user.name.split(' ')[0]}` : ''}! 👋
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      I'm your dedicated botanical AI assistant. Ask me anything about plant care, diagnose problems, or get personalized advice for your garden. I'm context-aware and know all about your plants!
                    </p>
                  </div>

                  {/* Quick Action Tiles */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { icon: <Droplets className="w-5 h-5" />, title: 'Watering Guide', desc: 'Get watering schedules for any plant', color: 'text-blue-600 bg-blue-50 border-blue-100' },
                      { icon: <Sun className="w-5 h-5" />, title: 'Light Advice', desc: 'Find the perfect spot for your plant', color: 'text-amber-600 bg-amber-50 border-amber-100' },
                      { icon: <Camera className="w-5 h-5" />, title: 'Diagnose Issues', desc: 'Identify plant health problems', color: 'text-rose-600 bg-rose-50 border-rose-100' },
                    ].map((tile) => (
                      <div key={tile.title} className={`rounded-2xl border p-4 cursor-default ${tile.color}`}>
                        <div className="mb-2">{tile.icon}</div>
                        <h3 className="font-bold text-sm text-gray-900 mb-1">{tile.title}</h3>
                        <p className="text-xs text-gray-600">{tile.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Quick Suggestions */}
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Suggested Questions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => sendMessage(s)}
                          className="text-xs px-3 py-2 rounded-full border border-gray-200 bg-white text-gray-700 hover:border-forest hover:text-forest hover:bg-forest/5 transition-all font-medium"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            {/* Quick Suggestions Row (when chat active) */}
            {messages.length > 0 && (
              <div className="px-4 sm:px-6 py-2 border-t border-gray-100 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                  {QUICK_SUGGESTIONS.slice(0, 4).map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-forest hover:text-forest transition-all whitespace-nowrap font-medium"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Input Bar ──────────────────────────────────────────────── */}
            <div className="border-t border-gray-200/80 bg-white px-4 sm:px-6 py-4">
              <div className="max-w-3xl mx-auto flex gap-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about watering, light, pests, repotting... (Enter to send)"
                    rows={1}
                    className="w-full px-4 py-3 pr-4 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest resize-none bg-gray-50 placeholder-gray-400 transition-all"
                    style={{ lineHeight: '1.5' }}
                  />
                </div>
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  className="w-12 h-12 rounded-2xl bg-forest hover:bg-forest/90 text-white flex items-center justify-center shadow-lg shadow-forest/20 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 flex-shrink-0"
                >
                  {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-2">
                AI responses are for guidance only. Always verify care with plant-specific resources.
              </p>
            </div>
          </div>

          {/* ── Sidebar: Garden Context ────────────────────────────────────── */}
          <aside
            className={`
              ${sidebarOpen ? 'flex' : 'hidden'} md:flex
              flex-col w-72 border-l border-gray-200/80 bg-white flex-shrink-0 overflow-y-auto
            `}
          >
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Sprout className="w-4 h-4 text-forest" />
                <h3 className="font-bold text-gray-900 text-sm">Your Garden Context</h3>
              </div>
              <p className="text-xs text-gray-500">AI is aware of your plants</p>
            </div>

            {!user ? (
              <div className="p-5 flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Log in to get personalized advice based on your actual plant collection.
                </p>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-forest hover:underline flex items-center gap-1"
                >
                  Sign in <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : gardenLoading ? (
              <div className="p-5 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : gardenPlants.length === 0 ? (
              <div className="p-5 flex flex-col items-center text-center space-y-3">
                <Sprout className="w-8 h-8 text-gray-300" />
                <p className="text-sm text-gray-500">No plants yet. Add some to get context-aware advice!</p>
                <Link
                  href="/plants/add"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-forest px-3 py-2 rounded-xl"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Plant
                </Link>
              </div>
            ) : (
              <div className="p-4 space-y-2 flex-1 overflow-y-auto">
                {gardenPlants.map((plant) => (
                  <Link
                    key={plant._id}
                    href={`/plants/${plant._id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
                  >
                    {/* Plant thumb */}
                    {plant.images[0] ? (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image
                          src={plant.images[0]}
                          alt={plant.customName}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center flex-shrink-0">
                        <Leaf className="w-5 h-5 text-forest" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800 truncate">{plant.customName}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${healthColor(plant.healthStatus)}`}>
                        {plant.healthStatus}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0" />
                  </Link>
                ))}

                {/* Add more plants CTA */}
                <Link
                  href="/plants/add"
                  className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-gray-200 hover:border-forest text-gray-400 hover:text-forest transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg border border-current flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold">Add another plant</span>
                </Link>
              </div>
            )}

            {/* Quick Links */}
            <div className="p-4 border-t border-gray-100 space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quick Links</p>
              {[
                { href: '/care-planner', icon: <Sprout className="w-4 h-4" />, label: 'Care Planner' },
                { href: '/my-garden', icon: <Leaf className="w-4 h-4" />, label: 'My Garden' },
                { href: '/explore', icon: <ChevronRight className="w-4 h-4" />, label: 'Explore Plants' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 text-xs text-gray-600 hover:text-forest font-medium py-1.5 hover:pl-1 transition-all"
                >
                  <span className="text-forest">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
