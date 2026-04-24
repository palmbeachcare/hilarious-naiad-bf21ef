import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Search, 
  Heart, 
  Smartphone, 
  Shield, 
  ShoppingCart, 
  Bot, 
  Edit3, 
  Zap, 
  Menu, 
  X,
  Phone,
  ArrowRight,
  Globe,
  Star,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { cn } from './lib/utils';
import { Persona, Category, Agent, Product, FeedEvent } from './types';
import { CATEGORIES, AGENTS, PRODUCTS, FEED_EVENTS } from './constants';
import { getChatResponse } from './services/geminiService';
import { CategoryResources } from './components/CategoryResources';
import { ToastContainer } from './components/Toast';
import ReactMarkdown from 'react-markdown';

// --- Components ---

const Pill = ({ text, color, glow }: { text: string; color: string; glow?: boolean }) => (
  <span 
    className={cn(
      "text-[10px] font-bold px-2 py-0.5 rounded-full tracking-tight border",
      glow ? "animate-pulse" : ""
    )}
    style={{ 
      backgroundColor: `${color}22`, 
      color: color,
      borderColor: glow ? `${color}44` : 'transparent'
    }}
  >
    {text}
  </span>
);

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={10} 
        className={cn(i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} 
      />
    ))}
  </div>
);

const AgentCard = ({ agent }: { agent: Agent }) => {
  const statusColor = agent.status === 'active' ? '#2d6a4f' : agent.status === 'standby' ? '#e76f51' : '#999';
  
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-elder-border p-4 transition-colors hover:bg-gray-50 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{agent.icon}</span>
          <div>
            <h3 className="text-sm font-bold text-elder-text">{agent.name}</h3>
            <div className="flex gap-1.5 mt-1">
              <Pill text={agent.status.toUpperCase()} color={statusColor} glow={agent.status === 'active'} />
              <Pill text={`${agent.patients} patients`} color="#0077b6" />
            </div>
          </div>
        </div>
        <div 
          className="w-2 h-2 rounded-full" 
          style={{ 
            backgroundColor: statusColor,
            boxShadow: agent.status === 'active' ? `0 0 8px ${statusColor}` : 'none'
          }} 
        />
      </div>
      <p className="text-xs text-elder-text-dim leading-relaxed mb-4">{agent.description}</p>
      <div className="flex gap-2">
        <button className="flex-1 py-1.5 rounded-lg border border-elder-border bg-transparent text-elder-text-dim text-[10px] font-semibold hover:bg-gray-100 transition-colors">
          Configure
        </button>
        <button 
          className={cn(
            "flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-colors",
            agent.status === 'active' ? "bg-elder-accent/10 text-elder-accent hover:bg-elder-accent/20" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          )}
        >
          {agent.status === 'active' ? "View Logs" : "Activate"}
        </button>
      </div>
    </motion.div>
  );
};

const FeedItem = ({ event }: { event: FeedEvent }) => {
  const colors = { agent: '#2d6a4f', community: '#6a0572', service: '#0077b6', api: '#0096c7' };
  const color = colors[event.type] || '#999';

  return (
    <div className="flex gap-3 py-3 border-b border-elder-border/30 last:border-0">
      <div 
        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" 
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}44` }} 
      />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-elder-text flex items-center gap-1.5">
          <span>{event.icon}</span>
          {event.event}
        </div>
        <div className="text-[10px] text-elder-text-dim mt-0.5 leading-relaxed">{event.detail}</div>
      </div>
      <span className="text-[10px] text-gray-400 shrink-0">{event.time}</span>
    </div>
  );
};

const ProductCard = ({ product }: { product: Product }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="bg-white rounded-xl border border-elder-border p-4 transition-all hover:border-elder-accent/40 cursor-pointer relative group"
  >
    {product.interactive && (
      <div className="absolute top-3 right-3">
        <Pill text="⚡ INTERACTIVE" color="#2d6a4f" glow />
      </div>
    )}
    <div className="text-4xl text-center my-4">{product.icon}</div>
    <div className="text-xs font-bold text-elder-text text-center">{product.name}</div>
    <div className="text-[10px] text-gray-400 text-center mb-2">{product.brand} · {product.category}</div>
    <p className="text-[10px] text-elder-text-dim text-center leading-relaxed mb-4 line-clamp-2">{product.description}</p>
    <div className="text-center mb-4">
      <span className="text-lg font-extrabold text-elder-accent">{product.price}</span>
    </div>
    <div className="flex gap-2">
      <button className="flex-1 py-2 rounded-lg bg-elder-accent text-white text-[10px] font-bold hover:bg-elder-accent/90 transition-colors">
        {product.interactive ? "Connect" : "Order"}
      </button>
      <button className="flex-1 py-2 rounded-lg border border-elder-border bg-transparent text-elder-text-dim text-[10px] font-bold hover:bg-gray-50 transition-colors">
        Details
      </button>
    </div>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState('hub');
  const [persona, setPersona] = useState<Persona>('caregiver');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [pendingVoiceOrder, setPendingVoiceOrder] = useState<{ type: string; provider: string; icon: string } | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: string; parts: { text: string }[] }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const resourcesPanelRef = useRef<HTMLDivElement | null>(null);

  // Auto-close mobile menu when view changes (navigation)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [view]);

  // When a category is selected, nudge the inline panel into view.
  // Deferred via rAF so the panel has mounted and laid out before we measure.
  useEffect(() => {
    if (!selectedCategory) return;
    const frame = requestAnimationFrame(() => {
      resourcesPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [selectedCategory]);

  const navItems = [
    { id: 'hub', label: 'Hub', icon: Zap },
    { id: 'explore', label: 'Explore', icon: Globe },
    { id: 'myhealth', label: 'MyHealth', icon: Heart },
    { id: 'device', label: 'Device', icon: Smartphone },
    { id: 'insurance', label: 'Insurance', icon: Shield },
    { id: 'products', label: 'Products', icon: ShoppingCart },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'contribute', label: 'Contribute', icon: Edit3 },
    { id: 'api', label: 'API', icon: Activity },
  ];

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', parts: [{ text: userMessage }] }]);
    setIsTyping(true);

    try {
      const response = await getChatResponse(userMessage, chatHistory);
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: response }] }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: "I'm sorry, I'm having trouble connecting right now. Please try again or call our 24/7 support line." }] }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-elder-bg">
      {/* Navigation Header */}
      <header className="bg-white border-b border-elder-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-elder-accent to-[#40916c] flex items-center justify-center text-white font-black text-sm">
              E
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-lg font-extrabold leading-none">ElderHub</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Pill text="OS" color="#2d6a4f" glow />
                <div className="w-1.5 h-1.5 rounded-full bg-elder-accent" />
                <span className="text-[8px] text-gray-400 uppercase font-bold tracking-widest">Agentic Operations</span>
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5",
                  view === item.id 
                    ? "bg-elder-accent/10 text-elder-accent" 
                    : "text-gray-400 hover:text-elder-text hover:bg-gray-100"
                )}
              >
                <item.icon size={14} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-[10px] font-bold hover:bg-red-700 transition-colors">
              <Phone size={12} />
              URGENT
            </button>
            <div className="w-px h-6 bg-elder-border hidden sm:block" />
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="min-w-[44px] min-h-[44px] p-2 rounded-lg hover:bg-gray-100 lg:hidden flex items-center justify-center"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-panel"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-elder-accent/10 flex items-center justify-center text-elder-accent font-bold text-xs">
                {persona[0].toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav panel — visible only below lg breakpoint, toggled by hamburger */}
      <AnimatePresence initial={false}>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-panel"
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-white border-b border-elder-border sticky top-14 z-40"
          >
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={cn(
                      'min-h-[44px] px-3 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center gap-2',
                      view === item.id
                        ? 'bg-elder-accent/10 text-elder-accent'
                        : 'text-gray-600 hover:text-elder-text hover:bg-gray-100'
                    )}
                    aria-current={view === item.id ? 'page' : undefined}
                  >
                    <item.icon size={14} />
                    {item.label}
                  </button>
                ))}
              </div>
              <button className="mt-2 sm:hidden w-full min-h-[44px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 text-white text-[11px] font-bold hover:bg-red-700 transition-colors">
                <Phone size={14} />
                URGENT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {view === 'hub' && (
            <motion.div
              key="hub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Hero Section */}
              <section className="bg-gradient-to-br from-elder-accent/5 to-[#40916c]/5 rounded-2xl border border-elder-accent/10 p-8">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="max-w-2xl">
                    <h2 className="font-display text-3xl md:text-4xl font-black text-elder-text leading-tight">
                      {persona === 'senior' ? "Everything is OK today, Manoj." : "Elder Care, Reimagined."}
                    </h2>
                    <p className="text-sm text-elder-text-dim mt-4 leading-relaxed max-w-xl">
                      {persona === 'senior' 
                        ? "Your care team is monitoring everything. You have 2 things to do today. Tap the big buttons below if you need any help."
                        : "Not just a directory — an operating system for aging well. Autonomous AI agents monitor 24/7, providers self-register, and families collaborate in real-time."
                      }
                    </p>
                    <div className="flex flex-wrap gap-3 mt-6">
                      <button className={cn(
                        "rounded-xl font-bold transition-all shadow-lg flex items-center gap-2",
                        persona === 'senior' ? "px-8 py-4 text-lg bg-elder-accent text-white shadow-elder-accent/30" : "px-5 py-2.5 text-xs bg-elder-accent text-white shadow-elder-accent/20"
                      )}>
                        {persona === 'senior' ? "What do I do next?" : "Get Started"} <ArrowRight size={persona === 'senior' ? 20 : 14} />
                      </button>
                      <button className={cn(
                        "rounded-xl border border-elder-border bg-white text-elder-text font-bold hover:bg-gray-50 transition-all",
                        persona === 'senior' ? "px-8 py-4 text-lg" : "px-5 py-2.5 text-xs"
                      )}>
                        {persona === 'senior' ? "Call Care Team" : "How it works"}
                      </button>
                    </div>
                  </div>
                  {persona !== 'senior' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 shrink-0">
                      {[
                        { label: "Categories", value: String(CATEGORIES.length), color: "#2d6a4f" },
                        { label: "AI Agents", value: "6", color: "#0077b6" },
                        { label: "Active Status", value: "24/7", color: "#6a0572" },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/50 backdrop-blur-sm border border-white/50 rounded-2xl p-4 text-center min-w-[100px]">
                          <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Persona-specific content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {persona === 'senior' ? (
                    <div className="space-y-6">
                      <AnimatePresence>
                        {pendingVoiceOrder && (
                          <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-elder-accent border-4 border-white rounded-3xl p-8 shadow-2xl"
                          >
                            <div className="flex items-center gap-6">
                              <div className="text-7xl animate-bounce">{pendingVoiceOrder.icon}</div>
                              <div className="flex-1">
                                <h3 className="text-3xl font-black text-white">Verify Your Request</h3>
                                <p className="text-xl text-white/80 mt-2">
                                  You asked Alexa for a <strong>{pendingVoiceOrder.type}</strong> from <strong>{pendingVoiceOrder.provider}</strong>.
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-8">
                              <button 
                                onClick={() => setPendingVoiceOrder(null)}
                                className="bg-white/20 text-white py-6 rounded-2xl text-2xl font-black hover:bg-white/30 transition-all"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={() => {
                                  alert('Order Finalized! Your care team has been notified.');
                                  setPendingVoiceOrder(null);
                                }}
                                className="bg-white text-elder-accent py-6 rounded-2xl text-2xl font-black shadow-lg hover:scale-105 transition-all"
                              >
                                Yes, Order Now!
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                          { title: "Take evening meds", time: "6:00 PM", icon: "💊", color: "#f77f00" },
                          { title: "Ride to Doctor", time: "Tomorrow 10 AM", icon: "🚗", color: "#0077b6" },
                        ].map((task, i) => (
                          <button key={i} className="bg-white border-2 border-elder-border rounded-3xl p-8 text-left hover:border-elder-accent transition-all group">
                            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{task.icon}</div>
                            <h3 className="text-2xl font-black text-elder-text">{task.title}</h3>
                            <p className="text-lg text-gray-400 mt-2">{task.time}</p>
                          </button>
                        ))}
                      </div>

                      <div className="bg-white border-2 border-dashed border-elder-border rounded-3xl p-8 text-center">
                        <div className="text-4xl mb-4">🗣️</div>
                        <h3 className="text-xl font-bold text-elder-text">Voice Command Simulation</h3>
                        <p className="text-sm text-elder-text-dim mt-2 mb-6">For the prototype, click below to simulate an Alexa voice request.</p>
                        <div className="flex flex-wrap justify-center gap-3">
                          <button 
                            onClick={() => setPendingVoiceOrder({ type: 'Tesla Ride', provider: 'Tesla Care', icon: '🚕' })}
                            className="px-6 py-3 bg-gray-100 rounded-xl text-xs font-bold hover:bg-elder-accent hover:text-white transition-all"
                          >
                            "Alexa, I need a ride"
                          </button>
                          <button 
                            onClick={() => setPendingVoiceOrder({ type: 'Haircut', provider: 'Mobile Spa', icon: '💇' })}
                            className="px-6 py-3 bg-gray-100 rounded-xl text-xs font-bold hover:bg-elder-accent hover:text-white transition-all"
                          >
                            "Alexa, book a haircut"
                          </button>
                          <button 
                            onClick={() => setPendingVoiceOrder({ type: 'Handyman', provider: 'Home Repair', icon: '🔧' })}
                            className="px-6 py-3 bg-gray-100 rounded-xl text-xs font-bold hover:bg-elder-accent hover:text-white transition-all"
                          >
                            "Alexa, I need a handyman"
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                          type="text" 
                          placeholder="Search services, providers, products, or conditions..."
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-elder-border bg-white focus:outline-none focus:ring-2 focus:ring-elder-accent/20 focus:border-elder-accent transition-all text-sm"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>

                      <section className="bg-white rounded-2xl border border-elder-border p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Persona View</h3>
                            <p className="text-sm font-bold text-elder-text mt-1">Tailor your experience</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {[
                            { id: 'senior', label: 'Senior', icon: '👴', color: '#2d6a4f', desc: 'Simple & Calm' },
                            { id: 'caregiver', label: 'Caregiver', icon: '👨‍👩‍👧', color: '#0077b6', desc: 'Command Center' },
                            { id: 'provider', label: 'Provider', icon: '🩺', color: '#6a0572', desc: 'Clinical Data' },
                            { id: 'partner', label: 'Partner', icon: '🔌', color: '#f77f00', desc: 'API & Dev' },
                          ].map((p) => (
                            <button
                              key={p.id}
                              onClick={() => setPersona(p.id as Persona)}
                              className={cn(
                                "p-4 rounded-xl border-2 transition-all text-center group",
                                persona === p.id 
                                  ? "bg-white border-elder-accent shadow-xl shadow-elder-accent/5" 
                                  : "bg-gray-50 border-transparent hover:bg-white hover:border-gray-200"
                              )}
                            >
                              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{p.icon}</div>
                              <div className="text-xs font-bold text-elder-text">{p.label}</div>
                              <div className="text-[9px] text-gray-400 mt-1">{p.desc}</div>
                            </button>
                          ))}
                        </div>
                      </section>
                    </>
                  )}

                  {/* Status Banner */}
                  <div className="bg-elder-accent/5 border border-elder-accent/20 rounded-2xl p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-elder-accent/10 flex items-center justify-center text-2xl">
                        {persona === 'senior' ? "👍" : "✅"}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-elder-accent">
                          {persona === 'senior' ? "You are doing great!" : "All systems healthy today"}
                        </h4>
                        <p className="text-xs text-elder-text-dim mt-1">
                          {persona === 'senior' 
                            ? "Your blood pressure is normal and your daughter Sarah checked in 10 mins ago."
                            : "6 agents active · 0 urgent alerts · 3 actions completed · Next: evening meds at 8 PM"
                          }
                        </p>
                      </div>
                    </div>
                    {persona !== 'senior' && (
                      <button className="px-4 py-2 rounded-lg bg-elder-accent text-white text-[10px] font-bold hover:bg-elder-accent/90 transition-colors shrink-0">
                        Call Care Team
                      </button>
                    )}
                  </div>

                  {/* Categories Grid (only for non-senior) */}
                  {persona !== 'senior' && (
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Service Categories</h3>
                          <button onClick={() => setView('explore')} className="text-[10px] font-bold text-elder-accent hover:underline">View all {CATEGORIES.length}+</button>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {CATEGORIES.slice(0, 11).map(cat => (
                            <motion.button
                              key={cat.id}
                              whileHover={{ y: -2 }}
                              className="bg-white border border-elder-border rounded-xl p-4 flex flex-col items-center text-center hover:border-elder-accent/30 transition-all"
                            >
                              <span className="text-3xl mb-2">{cat.icon}</span>
                              <span className="text-[10px] font-bold text-elder-text leading-tight">{cat.name}</span>
                            </motion.button>
                          ))}
                          <button onClick={() => setView('contribute')} className="bg-elder-accent/5 border border-dashed border-elder-accent/30 rounded-xl p-4 flex flex-col items-center text-center hover:bg-elder-accent/10 transition-all">
                            <span className="text-3xl mb-2">➕</span>
                            <span className="text-[10px] font-bold text-elder-accent leading-tight">Suggest New</span>
                          </button>
                        </div>
                      </div>

                      <section className="bg-white rounded-2xl border border-elder-border p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Dynamic Data Integrations</h3>
                          <Pill text="LIVE SYNC" color="#2d6a4f" glow />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          {[
                            { name: "Amazon Care", desc: "Real-time pricing for DME & supplies", icon: "📦", color: "#f77f00" },
                            { name: "CMS Data", desc: "Official provider quality & star ratings", icon: "📋", color: "#0077b6" },
                            { name: "Google Maps", icon: "🗺️", desc: "Real-time traffic & mobile provider locations", color: "#2d6a4f" },
                          ].map((d, i) => (
                            <div key={i} className="flex gap-4">
                              <div className="text-3xl">{d.icon}</div>
                              <div>
                                <div className="text-xs font-bold text-elder-text">{d.name}</div>
                                <div className="text-[10px] text-gray-400 mt-1 leading-tight">{d.desc}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Live Feed */}
                  {persona !== 'senior' && (
                    <section className="bg-white rounded-2xl border border-elder-border p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-elder-text flex items-center gap-2">
                          <Activity size={16} className="text-elder-accent" />
                          Live Activity
                        </h3>
                        <div className="flex gap-1">
                          {['All', 'Agents'].map(f => (
                            <button key={f} className="px-2 py-0.5 rounded bg-gray-100 text-[8px] font-bold text-gray-500 hover:bg-gray-200">
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1">
                        {FEED_EVENTS.map((event, i) => (
                          <FeedItem key={i} event={event} />
                        ))}
                      </div>
                      <button className="w-full mt-4 py-2 text-[10px] font-bold text-gray-400 hover:text-elder-accent transition-colors">
                        View full history →
                      </button>
                    </section>
                  )}

                  {/* Agent Status */}
                  {persona !== 'senior' && (
                    <section className="bg-white rounded-2xl border border-elder-border p-6">
                      <h3 className="text-sm font-bold text-elder-text mb-4 flex items-center gap-2">
                        <Bot size={16} className="text-elder-accent" />
                        Agent Fleet
                      </h3>
                      <div className="space-y-3">
                        {AGENTS.slice(0, 4).map(agent => (
                          <div key={agent.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <span className="text-xl">{agent.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-[11px] font-bold text-elder-text truncate">{agent.name}</div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <div className={cn("w-1.5 h-1.5 rounded-full", agent.status === 'active' ? "bg-elder-accent" : "bg-orange-500")} />
                                <span className="text-[9px] text-gray-400 font-medium">{agent.status}</span>
                              </div>
                            </div>
                            {agent.actions > 0 && (
                              <div className="bg-orange-100 text-orange-600 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                {agent.actions}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => setView('agents')}
                        className="w-full mt-4 py-2 rounded-lg border border-elder-border text-[10px] font-bold text-elder-text-dim hover:bg-gray-50 transition-colors"
                      >
                        Manage Fleet →
                      </button>
                    </section>
                  )}

                  {/* Revenue Pulse */}
                  {persona !== 'senior' && (
                    <section className="bg-white rounded-2xl border border-elder-border p-6">
                      <h3 className="text-sm font-bold text-elder-text mb-4">Revenue Pulse</h3>
                      <div className="space-y-3">
                        {[
                          { label: "Referral fees", value: "$19,600/mo", color: "#2d6a4f" },
                          { label: "Product commissions", value: "$8,400/mo", color: "#0096c7" },
                          { label: "Premium tiers", value: "$45,871/mo", color: "#0077b6" },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="text-[10px] text-gray-500 font-medium">{item.label}</span>
                            <span className="text-[11px] font-bold" style={{ color: item.color }}>{item.value}</span>
                          </div>
                        ))}
                        <div className="pt-3 border-t border-elder-border flex justify-between items-center">
                          <span className="text-xs font-bold text-elder-text">Platform Total</span>
                          <span className="text-lg font-black text-elder-accent">$79,171/mo</span>
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              </div>

              {/* AI Care Advisor Section (only for non-senior) */}
              {persona !== 'senior' && (
                <section className="bg-white rounded-2xl border border-elder-border p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-elder-text flex items-center gap-2">
                        <Zap size={20} className="text-elder-accent" />
                        AI Care Advisor — "What's Best For Me?"
                      </h3>
                      <p className="text-sm text-elder-text-dim mt-2 max-w-2xl">
                        Tell us your condition and AI recommends the best combination of services, 
                        products, and providers — with real reviews aggregated from Medicare.gov, 
                        Google, Caring.com, and Doximity.
                      </p>
                    </div>
                    <Pill text="VERIFIED SOURCES ONLY" color="#2d6a4f" glow />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { cond: "Dementia / Alzheimer's", icon: "🧠", rec: "Memory care, companion, GUIDE Model, ElliQ robot", source: "CMS GUIDE data, Alzheimer's Assn" },
                      { cond: "Wheelchair / Mobility", icon: "🦽", rec: "DME, home mod, NEMT transport, private duty", source: "Medicare DME ratings, Google" },
                      { cond: "COPD / Oxygen Needs", icon: "💨", rec: "Home health, RPM pulse ox, mobile labs, MACE", source: "CMS star ratings, Doximity" },
                      { cond: "Post-Hospital Discharge", icon: "🏥", rec: "Med reconciliation, mobile labs, transport", source: "Hospital readmission data, CMS" },
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ y: -2 }}
                        className="p-5 rounded-2xl border border-elder-border hover:border-elder-accent/30 transition-all cursor-pointer group"
                      >
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                        <div className="text-xs font-bold text-elder-text">{item.cond}</div>
                        <p className="text-[10px] text-elder-text-dim mt-2 leading-relaxed">AI recommends: {item.rec}</p>
                        <div className="text-[9px] font-bold text-elder-accent mt-3 flex items-center gap-1">
                          <Activity size={10} />
                          Reviews from: {item.source}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 rounded-xl bg-blue-50 border border-blue-100 flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mr-2">Verified Sources:</span>
                    {[
                      "Medicare.gov", "CMS Care Compare", "Google Business", "Doximity", "Caring.com", "VA Quality", "State Health Inspection", "BBB"
                    ].map(s => (
                      <span key={s} className="px-2 py-0.5 bg-white border border-blue-200 rounded text-[9px] font-bold text-blue-600">{s}</span>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {view === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="font-display text-2xl font-black text-elder-text">Products & Smart Devices</h2>
                  <p className="text-sm text-elder-text-dim mt-1">Interactive devices connect to ElderHub agents. Passive products ship to door.</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-xl bg-white border border-elder-border text-xs font-bold text-elder-text hover:bg-gray-50">
                    Filter
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-elder-accent text-white text-xs font-bold shadow-lg shadow-elder-accent/20">
                    New Arrivals
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {PRODUCTS.map((product, i) => (
                  <ProductCard key={i} product={product} />
                ))}
              </div>

              <section className="bg-elder-accent/5 border border-elder-accent/20 rounded-2xl p-8">
                <h3 className="text-lg font-bold text-elder-accent mb-4">⚡ How Interactive Products Work</h3>
                <p className="text-sm text-elder-text-dim leading-relaxed max-w-3xl">
                  Products marked ⚡ INTERACTIVE connect directly to ElderHub AI agents. 
                  Example: Hero Smart Dispenser detects a missed dose → MedGuard Agent auto-calls the patient → 
                  if no response in 15 min, dispatches on-demand gig helper → if critical, alerts MACE team and family. 
                  All logged to CRM. Medicare-billable under RPM (CPT 99453-99458).
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Future Tech Roadmap</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { n: "Ambient Radar", d: "No-camera fall/gait monitoring via WiFi signals", i: "📶", eta: "Q3 2026" },
                    { n: "Care Companion Robots", d: "ElliQ, Paro, next-gen AI carebots. Rent or buy.", i: "🤖", eta: "Now" },
                    { n: "VR Reminiscence", d: "Childhood home recreation for memory care", i: "🥽", eta: "Q4 2026" },
                    { n: "Blockchain Passport", d: "Patient-owned encrypted records. Smart contract POAs.", i: "🔐", eta: "2027" },
                  ].map((p, i) => (
                    <div key={i} className="bg-white border border-elder-border rounded-2xl p-5">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-3xl">{p.i}</span>
                        <Pill text={p.eta} color="#0077b6" />
                      </div>
                      <div className="text-xs font-bold text-elder-text">{p.n}</div>
                      <div className="text-[10px] text-gray-400 mt-1 leading-relaxed">{p.d}</div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {view === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="font-display text-2xl font-black text-elder-text">Explore Services & Providers</h2>
                  <p className="text-sm text-elder-text-dim mt-1">{CATEGORIES.length} categories · Community-maintained · Anyone can add or edit</p>
                </div>
                {selectedCategory && (
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="text-xs font-bold text-elder-accent hover:underline"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search services, providers, or conditions..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-elder-border bg-white focus:outline-none focus:ring-2 focus:ring-elder-accent/20 focus:border-elder-accent transition-all text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {Array.from(new Set(CATEGORIES.map(c => c.group))).map(group => {
                    const groupCategories = CATEGORIES.filter(c => c.group === group);
                    const selectedInThisGroup = !!selectedCategory && groupCategories.some(c => c.id === selectedCategory);
                    return (
                    <div key={group} className="space-y-4">
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">{group}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {groupCategories.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                            className={cn(
                              "bg-white border rounded-xl p-4 flex items-center gap-3 transition-all text-left",
                              selectedCategory === cat.id ? "border-elder-accent ring-2 ring-elder-accent/10" : "border-elder-border hover:border-elder-accent/30"
                            )}
                          >
                            <span className="text-2xl">{cat.icon}</span>
                            <span className="text-[11px] font-bold text-elder-text leading-tight">{cat.name}</span>
                          </button>
                        ))}
                      </div>
                      {/* Inline resources panel: renders directly under the group
                          that owns the tapped tile, so the answer appears next to
                          the question. Only one group can be 'selected' at a time. */}
                      {selectedInThisGroup && (
                        <div
                          ref={resourcesPanelRef}
                          className="scroll-mt-24"
                          aria-live="polite"
                        >
                          <CategoryResources categoryId={selectedCategory} />
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>

                <div className="space-y-6">
                  <section className="bg-white rounded-2xl border border-elder-border p-6">
                    <h3 className="text-sm font-bold text-elder-text mb-4">🚕 Mobile Partnerships</h3>
                    <div className="space-y-4">
                      {[
                        { name: "Tesla Robotaxi Care", desc: "Autonomous transport with care-trained AI", icon: "🚕", status: "Active" },
                        { name: "Uber Health Plus", desc: "HIPAA-compliant NEMT dispatch", icon: "🚗", status: "Active" },
                      ].map((p, i) => (
                        <div key={i} className="p-4 rounded-xl border border-elder-border bg-gray-50 flex items-center gap-4">
                          <div className="text-3xl">{p.icon}</div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-elder-text">{p.name}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">{p.desc}</div>
                          </div>
                          <Pill text={p.status} color="#2d6a4f" />
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="bg-white rounded-2xl border border-elder-border p-6 sticky top-24">
                    <h3 className="text-sm font-bold text-elder-text mb-4">📍 Palm Beach County Providers</h3>
                    <div className="aspect-square rounded-xl overflow-hidden border border-elder-border bg-gray-100 relative">
                      <iframe 
                        title="map" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        loading="lazy"
                        src="https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=elder+care+Palm+Beach+County+FL&zoom=10"
                      />
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <MapPin size={16} className="text-elder-accent" />
                        <div className="text-[10px] text-elder-text-dim">Showing 124 verified providers in your area.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'myhealth' && (
            <motion.div
              key="myhealth"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="font-display text-2xl font-black text-elder-text">My Health Dashboard</h2>
                  <p className="text-sm text-elder-text-dim mt-1">Connect wearables, track vitals, and update your care status.</p>
                </div>
              </div>

              <section className="bg-white rounded-2xl border border-elder-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-elder-text">📍 Where Are You Right Now?</h3>
                  <Pill text="AI CONTEXT ACTIVE" color="#2d6a4f" glow />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { l: "At Home", i: "🏠", active: true },
                    { l: "Hospital", i: "🏥", active: false },
                    { l: "Nursing Facility", i: "🏥", active: false },
                    { l: "Rehab Center", i: "🏋️", active: false },
                    { l: "Traveling", i: "✈️", active: false },
                  ].map((s, i) => (
                    <button
                      key={i}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-center",
                        s.active 
                          ? "bg-elder-accent/5 border-elder-accent" 
                          : "bg-gray-50 border-transparent hover:bg-white hover:border-gray-200"
                      )}
                    >
                      <div className="text-2xl mb-2">{s.i}</div>
                      <div className={cn("text-[10px] font-bold", s.active ? "text-elder-accent" : "text-gray-500")}>{s.l}</div>
                    </button>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <section className="bg-white rounded-2xl border border-elder-border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold text-elder-text flex items-center gap-2">
                        <Shield size={16} className="text-elder-accent" />
                        Identity & Insurance Vault
                      </h3>
                      <Pill text="OCR ENABLED" color="#2d6a4f" glow />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "Driver's License / ID", icon: "🪪", status: "Verified" },
                        { label: "Insurance Card (Front)", icon: "🛡️", status: "Verified" },
                        { label: "Insurance Card (Back)", icon: "🛡️", status: "Verified" },
                        { label: "Passport", icon: "🛂", status: "Not Scanned" },
                      ].map((doc, i) => (
                        <div key={i} className="p-4 rounded-xl border border-elder-border bg-gray-50 flex items-center justify-between group hover:border-elder-accent/30 transition-all cursor-pointer">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{doc.icon}</span>
                            <div>
                              <div className="text-[11px] font-bold text-elder-text">{doc.label}</div>
                              <div className="text-[9px] text-gray-400 mt-0.5">{doc.status}</div>
                            </div>
                          </div>
                          <button className="p-2 rounded-lg bg-white border border-elder-border text-elder-accent hover:bg-elder-accent hover:text-white transition-all">
                            <Smartphone size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 rounded-xl bg-elder-accent/5 border border-dashed border-elder-accent/30 flex flex-col items-center justify-center text-center py-8">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl mb-3 shadow-sm">📸</div>
                      <div className="text-xs font-bold text-elder-text">Scan New Document</div>
                      <p className="text-[10px] text-elder-text-dim mt-1">AI will automatically extract data to your profile.</p>
                    </div>
                  </section>

                  <section className="bg-white rounded-2xl border border-elder-border p-6">
                    <h3 className="text-sm font-bold text-elder-text mb-4 flex items-center gap-2">
                      <Smartphone size={16} className="text-elder-accent" />
                      Connected Ecosystem
                    </h3>
                    <div className="space-y-4">
                      {[
                        { name: "Apple Watch Series 10", data: "HR: 72 bpm · SpO2: 97%", icon: "⌚", color: "#2d6a4f", status: "Connected" },
                        { name: "Amazon Echo Show 15", data: "Voice Hub · Video Ready", icon: "🗣️", color: "#f77f00", status: "Connected" },
                        { name: "Omron BP Monitor", data: "Last: 132/78 mmHg · 2 hrs ago", icon: "❤️", color: "#d62828", status: "Connected" },
                        { name: "FreeStyle Libre 3", data: "Glucose: 118 mg/dL · Stable", icon: "📊", color: "#0077b6", status: "Connected" },
                      ].map((d, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                          <span className="text-2xl">{d.icon}</span>
                          <div className="flex-1">
                            <div className="text-[11px] font-bold text-elder-text">{d.name}</div>
                            <div className="text-[9px] text-gray-400 mt-0.5">{d.data}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Pill text={d.status} color={d.color} glow={d.status === 'Connected'} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-elder-accent/30 text-elder-accent text-[10px] font-bold hover:bg-elder-accent/5 transition-all">
                      + Connect New Device or App
                    </button>
                  </section>
                </div>

                <div className="space-y-6">
                  <section className="bg-white rounded-2xl border border-elder-border p-6">
                    <h3 className="text-sm font-bold text-elder-text mb-4">🌿 Daily Wellness</h3>
                    <div className="space-y-5">
                      {[
                        { label: "Steps", current: "3,241", goal: "5,000", pct: 65, color: "#2d6a4f" },
                        { label: "Water", current: "4 cups", goal: "8 cups", pct: 50, color: "#0077b6" },
                        { label: "Sleep", current: "6.5 hrs", goal: "8 hrs", pct: 81, color: "#6a0572" },
                      ].map((w, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-elder-text">{w.label}</span>
                            <span className="text-[10px] text-gray-400">{w.current} / {w.goal}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${w.pct}%` }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: w.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="bg-elder-accent/5 border border-elder-accent/20 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-elder-accent mb-4 flex items-center gap-2">
                      <Zap size={16} />
                      AI Health Insights
                    </h3>
                    <div className="space-y-4">
                      {[
                        { text: "BP trending up (avg 138/82). Recommend telehealth follow-up.", priority: "high" },
                        { text: "Sleep interrupted 3x. May indicate UTI. Suggest urine test.", priority: "medium" },
                      ].map((r, i) => (
                        <div key={i} className="flex gap-3">
                          <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", r.priority === 'high' ? "bg-red-500" : "bg-orange-500")} />
                          <p className="text-[11px] text-elder-text leading-relaxed">{r.text}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'device' && (
            <motion.div
              key="device"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="font-display text-2xl font-black text-elder-text">ElderHub Device Program</h2>
                  <p className="text-sm text-elder-text-dim mt-1">One device, all services. Built-in cellular. No WiFi needed.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "ElderHub Pad", icon: "📱", price: "$49/mo", desc: "8\" simplified tablet with 4G LTE. Extra-large buttons, voice-ready.", color: "#2d6a4f", badge: "MOST POPULAR" },
                  { name: "ElderHub Band", icon: "⌚", price: "$19/mo", desc: "Wrist health monitor + emergency alert. Fall detection, GPS, SpO2.", color: "#0077b6", badge: "WEARABLE" },
                  { name: "ElderHub Home", icon: "🏠", price: "$29/mo", desc: "Voice-first smart display. Ambient radar fall detection (no cameras).", color: "#6a0572", badge: "AMBIENT" },
                ].map((d, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-elder-border p-8 relative flex flex-col">
                    {d.badge && (
                      <div className="absolute top-4 right-4">
                        <Pill text={d.badge} color={d.color} />
                      </div>
                    )}
                    <div className="text-5xl mb-6">{d.icon}</div>
                    <h3 className="text-lg font-bold text-elder-text">{d.name}</h3>
                    <div className="text-2xl font-black mt-2" style={{ color: d.color }}>{d.price}</div>
                    <p className="text-xs text-elder-text-dim mt-4 leading-relaxed flex-1">{d.desc}</p>
                    <button 
                      className="w-full mt-8 py-3 rounded-xl text-white text-xs font-bold transition-colors"
                      style={{ backgroundColor: d.color }}
                    >
                      Get {d.name} →
                    </button>
                  </div>
                ))}
              </div>

              <section className="bg-white rounded-2xl border border-elder-border p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-elder-text">🗣️ Smart Home & Voice Integration</h3>
                  <Pill text="ALEXA & SIRI READY" color="#f77f00" glow />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="text-3xl">🗣️</div>
                      <div>
                        <div className="text-sm font-bold text-elder-text">Amazon Echo Integration</div>
                        <p className="text-[11px] text-elder-text-dim mt-1 leading-relaxed">
                          "Alexa, ask ElderHub for my morning medication schedule."
                          "Alexa, tell ElderHub I'm feeling dizzy."
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="text-3xl">⌚</div>
                      <div>
                        <div className="text-sm font-bold text-elder-text">Apple Watch Sync</div>
                        <p className="text-[11px] text-elder-text-dim mt-1 leading-relaxed">
                          Real-time heart rate, fall detection, and movement tracking synced to your care team.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-elder-accent/5 rounded-2xl p-6 border border-elder-accent/20">
                    <h4 className="text-xs font-black text-elder-accent uppercase tracking-widest mb-4">Voice AI Capabilities</h4>
                    <ul className="space-y-3">
                      {[
                        "Voice-activated emergency dispatch",
                        "Empathetic daily check-in conversations",
                        "Multi-lingual support (EN, ES, FR, HT)",
                        "Smart home control (Lights, Temp, Locks)",
                      ].map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-[11px] text-elder-text">
                          <CheckCircle2 size={14} className="text-elder-accent" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-elder-border p-8">
                <h3 className="text-lg font-bold text-elder-text mb-6">🏥 Hospital Avoidance Protocols</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { cond: "CHF (Heart Failure)", trigger: "Weight ↑ 3lb in 2 days", path: "Weight alert → diuretic protocol → MACE IV fluids at home", color: "#d62828" },
                    { cond: "Falls & Fractures", trigger: "Gait speed ↓ 12%", path: "Gait anomaly → auto-schedule PT → order grab bars", color: "#f77f00" },
                  ].map((p, i) => (
                    <div key={i} className="p-5 rounded-2xl border border-elder-border bg-gray-50">
                      <div className="text-xs font-bold mb-2" style={{ color: p.color }}>{p.cond}</div>
                      <div className="text-[11px] font-bold text-elder-text">Trigger: <span className="font-normal text-gray-500">{p.trigger}</span></div>
                      <div className="text-[11px] font-bold text-elder-text mt-1">Pathway: <span className="font-normal text-gray-500">{p.path}</span></div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {view === 'insurance' && (
            <motion.div
              key="insurance"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="font-display text-2xl font-black text-elder-text">Insurance & Benefits Hub</h2>
                  <p className="text-sm text-elder-text-dim mt-1">Compare plans, connect with agents, and check eligibility.</p>
                </div>
              </div>

              <section className="bg-white rounded-2xl border border-elder-border p-6">
                <h3 className="text-sm font-bold text-elder-text mb-6">📋 Your Current Coverage</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { type: "Medicare Part A & B", plan: "Original Medicare", color: "#2d6a4f" },
                    { type: "Part D (Rx)", plan: "SilverScript Choice", color: "#0077b6" },
                    { type: "Medigap", plan: "Plan G — AARP/UHC", color: "#6a0572" },
                    { type: "Long-Term Care", plan: "Mutual of Omaha", color: "#f77f00" },
                  ].map((c, i) => (
                    <div key={i} className="p-4 rounded-xl border border-elder-border bg-gray-50">
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{c.type}</div>
                      <div className="text-xs font-bold mt-1" style={{ color: c.color }}>{c.plan}</div>
                      <div className="flex items-center gap-1.5 mt-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[9px] font-bold text-green-600">ACTIVE</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-elder-border p-6">
                <h3 className="text-sm font-bold text-elder-text mb-4">🛡️ Other Relevant Insurances</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { type: "Life Insurance", desc: "Final expense & legacy protection", icon: "💎" },
                    { type: "Home & Auto", desc: "Tesla Robotaxi liability coverage", icon: "🚗" },
                    { type: "Cyber Protection", desc: "Protection against senior scams", icon: "🔐" },
                  ].map((ins, i) => (
                    <div key={i} className="p-4 rounded-xl border border-elder-border hover:border-elder-accent/30 transition-all cursor-pointer">
                      <div className="text-2xl mb-2">{ins.icon}</div>
                      <div className="text-xs font-bold text-elder-text">{ins.type}</div>
                      <div className="text-[10px] text-gray-400 mt-1">{ins.desc}</div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="bg-white rounded-2xl border border-elder-border p-6">
                  <h3 className="text-sm font-bold text-elder-text mb-4">👤 Licensed Insurance Agents</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Maria Gonzalez", spec: "Medicare Advantage, Part D", lang: "EN, ES", rating: 4.8 },
                      { name: "James Whitfield", spec: "Medicare, Medicaid, VA", lang: "EN", rating: 4.7 },
                      { name: "Claudine Pierre", spec: "Medicare, Dual-Eligible, PACE", lang: "EN, HT, FR", rating: 4.9 },
                    ].map((a, i) => (
                      <div key={i} className="p-4 rounded-xl border border-elder-border hover:border-elder-accent/30 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-xs font-bold text-elder-text">{a.name}</div>
                            <div className="text-[10px] text-gray-400 mt-1">{a.spec}</div>
                            <div className="text-[9px] font-bold text-elder-accent mt-1">{a.lang}</div>
                          </div>
                          <Stars rating={a.rating} />
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button className="flex-1 py-1.5 rounded-lg bg-elder-accent text-white text-[10px] font-bold">Call</button>
                          <button className="flex-1 py-1.5 rounded-lg border border-elder-border text-[10px] font-bold">Message</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-white rounded-2xl border border-elder-border p-6">
                  <h3 className="text-sm font-bold text-elder-text mb-4">📅 Key Enrollment Dates</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Medicare Advantage OEP", date: "Jan 1 – Mar 31", active: false },
                      { name: "Medigap Open Enrollment", date: "Turning 65", active: true },
                      { name: "Annual Enrollment (AEP)", date: "Oct 15 – Dec 7", active: false },
                    ].map((d, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div>
                          <div className="text-[11px] font-bold text-elder-text">{d.name}</div>
                          <div className="text-[9px] text-gray-400 mt-0.5">{d.date}</div>
                        </div>
                        {d.active && <Pill text="OPEN NOW" color="#2d6a4f" glow />}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {view === 'agents' && (
            <motion.div
              key="agents"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="font-display text-2xl font-black text-elder-text">Autonomous Agent Fleet</h2>
                  <p className="text-sm text-elder-text-dim mt-1">AI agents that monitor, predict, and act 24/7.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {AGENTS.map(agent => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>

              <section className="bg-white rounded-2xl border border-elder-border p-8">
                <h3 className="text-lg font-bold text-elder-text mb-8 text-center">⚡ How Dispatch Works</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-8">
                  {[
                    { i: "📡", l: "Detect", d: "Device senses event" },
                    { i: "🧠", l: "Assess", d: "AI analyzes context" },
                    { i: "📞", l: "Contact", d: "AI calls patient" },
                    { i: "🚑", l: "Dispatch", d: "Escalates if needed" },
                    { i: "📋", l: "Log", d: "Auto-documentation" },
                  ].map((s, i) => (
                    <div key={i} className="text-center relative">
                      <div className="w-16 h-16 rounded-full bg-elder-accent/5 flex items-center justify-center text-3xl mx-auto mb-4 border border-elder-accent/10">
                        {s.i}
                      </div>
                      <div className="text-xs font-bold text-elder-accent">{s.l}</div>
                      <div className="text-[9px] text-gray-400 mt-1 leading-tight">{s.d}</div>
                      {i < 4 && (
                        <div className="hidden sm:block absolute top-8 -right-4 text-elder-accent/20">
                          <ChevronRight size={24} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {view === 'contribute' && (
            <motion.div
              key="contribute"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="font-display text-2xl font-black text-elder-text">Community Contributions</h2>
                  <p className="text-sm text-elder-text-dim mt-1">ElderHub is community-maintained like Wikipedia.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="bg-white rounded-2xl border border-elder-border p-8">
                  <h3 className="text-sm font-bold text-elder-text mb-6">📝 Add or Edit a Provider</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Business Name</label>
                        <input className="w-full px-4 py-2.5 rounded-xl border border-elder-border bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-elder-accent/20" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">City, FL</label>
                        <input className="w-full px-4 py-2.5 rounded-xl border border-elder-border bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-elder-accent/20" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</label>
                      <select className="w-full px-4 py-2.5 rounded-xl border border-elder-border bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-elder-accent/20">
                        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                      <textarea rows={4} className="w-full px-4 py-2.5 rounded-xl border border-elder-border bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-elder-accent/20 resize-none" />
                    </div>
                    <button className="w-full py-3 rounded-xl bg-elder-accent text-white text-xs font-bold hover:bg-elder-accent/90 transition-all shadow-lg shadow-elder-accent/20">
                      Submit for Review
                    </button>
                    <p className="text-[9px] text-gray-400 text-center">Requires 3 community verifications before going live.</p>
                  </div>
                </section>

                <div className="space-y-6">
                  <section className="bg-white rounded-2xl border border-elder-border p-6">
                    <h3 className="text-sm font-bold text-elder-text mb-4">🏆 Reputation System</h3>
                    <div className="space-y-4">
                      {[
                        { t: "Anyone can add", d: "Families, providers, social workers can all contribute." },
                        { t: "3-Vote Verification", d: "Independent verifications needed for live changes." },
                        { t: "Revenue Sharing", d: "Earn a cut from referrals generated by your listings." },
                      ].map((r, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-8 h-8 rounded-lg bg-elder-accent/5 flex items-center justify-center text-elder-accent shrink-0">
                            <CheckCircle2 size={16} />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-elder-text">{r.t}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{r.d}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="bg-white rounded-2xl border border-elder-border p-6">
                    <h3 className="text-sm font-bold text-elder-text mb-4">📊 Pending Reviews</h3>
                    <div className="space-y-3">
                      {[
                        { name: "Jupiter Mobile Dental", votes: "2/3", status: "Pending" },
                        { name: "Sunrise ALF pricing update", votes: "3/3", status: "Approved" },
                      ].map((p, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="text-[11px] font-bold text-elder-text">{p.name}</div>
                          <div className="flex items-center gap-2">
                            <Pill text={p.votes} color={p.status === 'Approved' ? "#2d6a4f" : "#f77f00"} />
                            <span className="text-[9px] font-bold text-gray-400">{p.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'api' && (
            <motion.div
              key="api"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="font-display text-2xl font-black text-elder-text">API & Developer Ecosystem</h2>
                  <p className="text-sm text-elder-text-dim mt-1">Build on the world's first elder care OS. Integrate Tesla, Uber, Amazon, and CMS data.</p>
                </div>
                <button className="px-4 py-2 rounded-xl bg-elder-accent text-white text-xs font-bold shadow-lg shadow-elder-accent/20">
                  Developer Portal →
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <section className="bg-white rounded-2xl border border-elder-border p-8">
                    <h3 className="text-sm font-bold text-elder-text mb-6">🔌 Core API Endpoints</h3>
                    <div className="bg-elder-text rounded-xl p-6 font-mono text-[10px] leading-loose">
                      <div className="flex gap-4"><span className="text-cyan-400">GET</span> <span className="text-white">/api/v1/providers</span> <span className="text-gray-500">// CMS & Community Data</span></div>
                      <div className="flex gap-4"><span className="text-cyan-400">GET</span> <span className="text-white">/api/v1/pricing/amazon</span> <span className="text-gray-500">// Real-time DME pricing</span></div>
                      <div className="flex gap-4"><span className="text-green-400">POST</span> <span className="text-white">/api/v1/dispatch/tesla</span> <span className="text-gray-500">// Autonomous transport</span></div>
                      <div className="flex gap-4"><span className="text-green-400">POST</span> <span className="text-white">/api/v1/agents/dispatch</span> <span className="text-gray-500">// AI Agentic action</span></div>
                      <div className="mt-4 text-gray-500">// FHIR R4 Interoperability</div>
                      <div className="flex gap-4"><span className="text-purple-400">GET</span> <span className="text-white">/fhir/Patient/:id</span></div>
                      <div className="flex gap-4"><span className="text-purple-400">GET</span> <span className="text-white">/fhir/Observation</span></div>
                    </div>
                  </section>

                  <section className="bg-white rounded-2xl border border-elder-border p-6">
                    <h3 className="text-sm font-bold text-elder-text mb-4">🤝 Partner Integrations</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { name: "Tesla", icon: "🚕", status: "Connected" },
                        { name: "Uber Health", icon: "🚗", status: "Connected" },
                        { name: "Epic App Orchard", icon: "🏥", status: "Certified" },
                        { name: "Cerner Code", icon: "🏥", status: "Certified" },
                        { name: "Salesforce Elixir", icon: "☁️", status: "Connected" },
                        { name: "Amazon", icon: "📦", status: "Connected" },
                        { name: "Google Maps", icon: "🗺️", status: "Connected" },
                        { name: "RingCentral", icon: "📞", status: "Beta" },
                        { name: "QuickBooks", icon: "💰", status: "Beta" },
                        { name: "Salesforce", icon: "☁️", status: "Planned" },
                        { name: "Epic/Cerner", icon: "🏥", status: "Planned" },
                      ].map((p, i) => (
                        <div key={i} className="p-3 rounded-xl border border-elder-border bg-gray-50 text-center">
                          <div className="text-2xl mb-1">{p.icon}</div>
                          <div className="text-[10px] font-bold text-elder-text">{p.name}</div>
                          <div className="text-[8px] text-gray-400 mt-0.5 uppercase tracking-widest">{p.status}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-6">
                  <section className="bg-white rounded-2xl border border-elder-border p-6">
                    <h3 className="text-sm font-bold text-elder-text mb-4">🏥 EMR & CRM Interoperability</h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xl">🏥</span>
                          <div className="text-xs font-bold text-blue-900">Epic & Cerner (SMART on FHIR)</div>
                        </div>
                        <p className="text-[10px] text-blue-800 leading-relaxed">
                          Launch ElderHub OS directly within the EMR workspace. Bi-directional sync for Patient, Observation, and CarePlan resources.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xl">☁️</span>
                          <div className="text-xs font-bold text-orange-900">Salesforce Elixir / Health Cloud</div>
                        </div>
                        <p className="text-[10px] text-orange-800 leading-relaxed">
                          Native integration with Elixir's clinical data model. Push care agent events and device vitals directly into Salesforce cases.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="bg-white rounded-2xl border border-elder-border p-6">
                    <h3 className="text-sm font-bold text-elder-text mb-4">🔑 Integration Tiers</h3>
                    <div className="space-y-4">
                      {[
                        { t: "Free", p: "$0", f: "Read-only access to providers" },
                        { t: "Developer", p: "$49/mo", f: "Read + Write, referrals, orders" },
                        { t: "Enterprise", p: "$499/mo", f: "FHIR, Agent dispatch, Webhooks" },
                        { t: "Platform Partner", p: "Revenue Share", f: "Full ecosystem access + co-marketing" },
                      ].map((t, i) => (
                        <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div>
                            <div className="text-[11px] font-bold text-elder-text">{t.t}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">{t.f}</div>
                          </div>
                          <div className="text-sm font-black text-elder-accent text-right">{t.p}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="bg-elder-accent/5 border border-elder-accent/20 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-elder-accent mb-4 flex items-center gap-2">
                      <Bot size={16} />
                      AI Agent SDK
                    </h3>
                    <p className="text-[10px] text-elder-text-dim leading-relaxed mb-4">
                      Software engineers can build custom agents that plug into the ElderHub fleet. 
                      Access real-time patient vitals, location, and care plans via secure FHIR hooks.
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 font-mono text-[9px] leading-relaxed text-elder-text">
                      <div className="text-gray-400">// Custom agent trigger</div>
                      <div className="mt-2 text-purple-600">const</div> <span className="text-blue-600">myAgent</span> = <span className="text-purple-600">new</span> <span className="text-yellow-600">ElderAgent</span>({'{'}
                      <div className="pl-4">id: <span className="text-green-600">"custom-triage"</span>,</div>
                      <div className="pl-4">triggers: [<span className="text-green-600">"vitals_anomaly"</span>],</div>
                      <div className="pl-4">action: <span className="text-blue-600">dispatchTesla</span></div>
                      {'}'});
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          )}

          {/* Add other views similarly... */}
        </AnimatePresence>
      </main>

      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-16 right-0 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-elder-border flex flex-col overflow-hidden"
            >
              <div className="bg-gradient-to-br from-elder-accent to-[#1b4332] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
                  <div>
                    <h4 className="text-white text-xs font-bold">ElderHub AI</h4>
                    <p className="text-white/60 text-[8px] uppercase tracking-widest font-bold">Agentic Operations</p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {chatHistory.length === 0 && (
                  <div className="text-center py-8 px-4">
                    <div className="w-12 h-12 rounded-full bg-elder-accent/10 flex items-center justify-center text-2xl mx-auto mb-4">
                      👋
                    </div>
                    <h5 className="text-xs font-bold text-elder-text">How can I help you today?</h5>
                    <p className="text-[10px] text-elder-text-dim mt-2 leading-relaxed">
                      I can find providers, check benefits, dispatch agents, 
                      order products, or answer care questions.
                    </p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed",
                      msg.role === 'user' 
                        ? "bg-elder-accent text-white self-end ml-auto rounded-tr-none" 
                        : "bg-white border border-elder-border text-elder-text self-start mr-auto rounded-tl-none shadow-sm"
                    )}
                  >
                    <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                  </div>
                ))}
                {isTyping && (
                  <div className="bg-white border border-elder-border p-3 rounded-2xl rounded-tl-none text-[11px] text-gray-400 self-start mr-auto shadow-sm">
                    Thinking...
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-elder-border">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask anything or give a command..."
                    className="flex-1 bg-gray-50 border border-elder-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-elder-accent/20"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={isTyping}
                    className="w-10 h-10 rounded-xl bg-elder-accent text-white flex items-center justify-center hover:bg-elder-accent/90 transition-colors disabled:opacity-50"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-elder-accent to-[#40916c] text-white flex items-center justify-center shadow-2xl shadow-elder-accent/40 hover:scale-105 transition-transform relative group"
        >
          {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
          {!isChatOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold">
              1
            </div>
          )}
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-elder-text py-12 px-4 mt-12 border-t border-elder-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-black text-sm">
                E
              </div>
              <h1 className="font-display text-lg font-extrabold text-white">ElderHub</h1>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              The world's first agentic elder care operating system. 
              Integrated services, AI agents, smart devices, and community-maintained registry.
            </p>
            <div className="flex gap-4">
              <Globe size={16} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
              <Activity size={16} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
              <Shield size={16} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          
          {[
            { title: "Platform", links: ["Hub", "Explore", "MyHealth", "Insurance"] },
            { title: "Ecosystem", links: ["Products", "Agents", "API", "Developers"] },
            { title: "Company", links: ["About", "Partners", "Privacy", "Terms"] },
          ].map((col, i) => (
            <div key={i} className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}>
                    <button className="text-[11px] text-gray-400 hover:text-white transition-colors">{link}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[9px] text-gray-500">
            © 2026 ElderHub OS · HIPAA Compliant · FHIR-native · Palm Beach County, FL
          </div>
          <div className="flex gap-6">
            <span className="text-[9px] text-gray-500">Medical Partner: <a href="https://palmbeachcare.com" className="text-gray-400 hover:underline">Palm Beach Elder Care</a></span>
          </div>
        </div>
      </footer>
      <ToastContainer />
    </div>
  );
}
