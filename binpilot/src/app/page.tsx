'use client';

import { useState } from 'react';
import {
  Trash2,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  Building2,
  Home,
  Droplets,
  Clock,
  Leaf,
  Menu,
  X,
  ArrowRight,
  AlertTriangle,
  Recycle,
  Send,
  Calendar,
  MessageSquare,
  Camera,
  RefreshCw,
} from 'lucide-react';

// Replace with your Formspree form ID after signing up at formspree.io
const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID';

export default function BinPilotPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    bins: [] as string[],
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Book', href: '#book' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
  ];

  const binOptions = ['Garbage bin', 'Recycling bin', 'Green bin'];

  const problems = [
    { emoji: '🪰', label: 'Flies & Maggots' },
    { emoji: '🦝', label: 'Raccoons & Skunks' },
    { emoji: '🐝', label: 'Wasps & Insects' },
    { emoji: '💨', label: 'Bad Odours' },
    { emoji: '🧫', label: 'Mold & Bacteria' },
    { emoji: '🗑️', label: 'Sticky Residue' },
  ];

  const whyUs = [
    { icon: Droplets, title: 'High-Pressure Hot Wash', desc: 'Inside and outside. Kills bacteria, mould, and odours without harsh chemicals.' },
    { icon: Clock, title: 'After Collection Day', desc: 'We sync with your pickup schedule so bins are empty when we arrive.' },
    { icon: Leaf, title: 'Eco-Friendly', desc: 'All wastewater is captured and disposed of responsibly — nothing into storm drains.' },
    { icon: MapPin, title: 'Your Neighbour', desc: 'Steve and his family live right here in the neighbourhood. This is a local service, for locals.' },
  ];

  const pathway = [
    {
      icon: Send,
      step: '1',
      title: 'You Book Online or Text',
      desc: 'Fill out the booking form below, or text BIN CLEAN to 519-729-3673. Takes 60 seconds.',
      color: 'text-green-400',
      bg: 'bg-green-500/10 border-green-500/20',
    },
    {
      icon: MessageSquare,
      step: '2',
      title: 'Steve Confirms',
      desc: 'You get a text or email confirmation within a few hours, with your scheduled clean date.',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      icon: Calendar,
      step: '3',
      title: 'Collection Day',
      desc: 'Put your bins out as normal. After they get emptied, Steve shows up and cleans them right at the curb.',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: Camera,
      step: '4',
      title: 'Photo Sent to You',
      desc: 'Once done, you get a before-and-after photo. Bins are back in place. You never lifted a finger.',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      icon: RefreshCw,
      step: '5',
      title: 'Repeat Monthly',
      desc: 'Stay on the schedule and your bins are cleaned every month automatically. No re-booking needed.',
      color: 'text-green-400',
      bg: 'bg-green-500/10 border-green-500/20',
    },
  ];

  const faqs = [
    {
      q: 'Where exactly do you service?',
      a: "We service Mimico and New Toronto. Not sure if you're in our zone? Just text us at 519-729-3673 and we'll confirm right away.",
    },
    {
      q: 'Do I need to be home?',
      a: 'No. As long as your bins are at the curb after collection, we take care of everything and put them back in place. We send you a photo when done.',
    },
    {
      q: 'Which bins do you clean?',
      a: 'We clean all three: garbage bins, blue recycling bins, and green organics bins.',
    },
    {
      q: 'How does pricing work?',
      a: "Simple — $25 for 1 bin, $40 for 2 bins, $50 for 3 bins. That's the introductory neighbourhood rate. No hidden fees.",
    },
    {
      q: 'What happens in winter?',
      a: 'We operate year-round. Cold weather is actually when bin cleaning matters most — frozen organic matter causes lasting odour problems.',
    },
    {
      q: 'How do you handle the wastewater?',
      a: 'All wastewater is captured in our tank and disposed of properly. Nothing goes into storm drains or onto your property.',
    },
  ];

  function toggleBin(bin: string) {
    setForm((f) => ({
      ...f,
      bins: f.bins.includes(bin) ? f.bins.filter((b) => b !== bin) : [...f.bins, bin],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          address: form.address,
          phone: form.phone,
          email: form.email,
          bins: form.bins.join(', '),
          notes: form.notes,
        }),
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white">

      {/* ── Nav ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
              <Trash2 size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Bin<span className="text-green-400">Pilot</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <a
            href="#book"
            className="hidden md:inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Book Online
          </a>

          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0a0f0a] px-4 py-4 space-y-3">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="block text-slate-300 hover:text-white py-1 text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#book"
              className="block mt-2 bg-green-500 text-black font-semibold text-sm px-4 py-2 rounded-lg text-center"
              onClick={() => setMobileOpen(false)}
            >
              Book Online
            </a>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <MapPin size={12} />
            Serving Mimico &amp; New Toronto
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Dirty bins?<br />
            <span className="text-green-400">We&apos;ve got you.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Professional curbside bin cleaning for Mimico and New Toronto homes and multi-unit buildings.
            Garbage, recycling, and green bins — cleaned right at your curb after collection day.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#book"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-7 py-3.5 rounded-xl text-base transition-colors"
            >
              Book Online <ArrowRight size={16} />
            </a>
            <a
              href="sms:+15197293673&body=BIN CLEAN"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-colors"
            >
              <Phone size={16} />
              Text BIN CLEAN — 519-729-3673
            </a>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-green-400" />
              <span>Local neighbour — family lives here</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-green-400" />
              <span>No hauling bins anywhere</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-green-400" />
              <span>Limited spots this week</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── About / Personal intro ── */}
      <section id="about" className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
                Hi Neighbours
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-5">My name is Steve.</h2>
              <p className="text-slate-300 leading-relaxed mb-4 text-lg">
                My family and I live right here in the neighbourhood.
              </p>
              <p className="text-slate-400 leading-relaxed mb-4">
                I started a simple curbside bin cleaning service and I&apos;m looking for a few homes to help me test it out.
                If your garbage, recycling, or green bins are attracting flies, maggots, raccoons, or just plain stink — I clean them for you.
              </p>
              <p className="text-slate-400 leading-relaxed mb-6">
                High-pressure wash, inside and outside, done right at your curb. No hauling bins anywhere.
              </p>
              <a
                href="#book"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Book a Clean
              </a>
            </div>

            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-5">
                <AlertTriangle size={16} className="text-amber-400" />
                <span className="font-semibold text-amber-400 text-sm">What&apos;s living inside your bin?</span>
              </div>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Most homeowners never look inside — until the smell hits. Your bins may be attracting:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {problems.map((p) => (
                  <div key={p.label} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <span className="text-lg leading-none">{p.emoji}</span>
                    <span>{p.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-white/8">
                <p className="text-green-400 text-sm font-semibold">Your bins don&apos;t have to look like this.</p>
                <p className="text-slate-500 text-xs mt-1">Professional curbside cleaning — garbage, recycling &amp; green bins.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Before / After ── */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Before &amp; After</h2>
          <p className="text-slate-400 max-w-xl mx-auto">The difference one clean makes.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl overflow-hidden border border-red-500/20 bg-white/[0.02]">
            <div className="bg-red-500/10 px-5 py-3 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-red-400 font-semibold text-sm tracking-wide uppercase">Before</span>
            </div>
            <div className="aspect-[4/3] flex items-center justify-center p-8 text-center">
              <div>
                <span className="text-5xl block mb-4">🗑️</span>
                <p className="text-slate-500 text-sm leading-relaxed">Mold, maggots, bacteria, rotting food residue, sticky grime — and the smell.</p>
                <p className="mt-4 text-slate-700 text-xs italic">Photo coming soon</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-green-500/20 bg-white/[0.02]">
            <div className="bg-green-500/10 px-5 py-3 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-green-400 font-semibold text-sm tracking-wide uppercase">After</span>
            </div>
            <div className="aspect-[4/3] flex items-center justify-center p-8 text-center">
              <div>
                <span className="text-5xl block mb-4">✨</span>
                <p className="text-slate-400 text-sm leading-relaxed">Clean, deodorized, and fresh. The smell is gone. The bugs are gone. Done right at your curb.</p>
                <p className="mt-4 text-slate-700 text-xs italic">Photo coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              Neighbourhood Intro Offer
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">What you get</h2>
            <p className="text-slate-400">Every clean includes everything. No tiers, no upsells.</p>
          </div>

          {/* What's included */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8 mb-6">
            <ul className="space-y-4">
              {[
                { emoji: '💦', text: 'High-pressure hot water wash — inside and outside' },
                { emoji: '🧴', text: 'Deodorizing treatment — smell is gone after one clean' },
                { emoji: '🗑️', text: 'All bin types — garbage, recycling, and green bin' },
                { emoji: '🏠', text: 'Done right at your curb — no hauling anywhere' },
                { emoji: '📸', text: 'Before & after photo sent to you when done' },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-slate-300 text-sm">
                  <span className="text-xl leading-none mt-0.5">{item.emoji}</span>
                  <span className="leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { bins: '1 Bin', price: '$25' },
              { bins: '2 Bins', price: '$40', highlight: true },
              { bins: '3 Bins', price: '$50' },
            ].map((p) => (
              <div
                key={p.bins}
                className={`rounded-2xl p-5 text-center ${
                  p.highlight
                    ? 'bg-green-500/10 border-2 border-green-500/40'
                    : 'bg-white/[0.03] border border-white/8'
                }`}
              >
                <span className="text-slate-400 text-xs font-medium block mb-1">{p.bins}</span>
                <span className="text-3xl font-extrabold">{p.price}</span>
              </div>
            ))}
          </div>

          <a
            href="#book"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl transition-colors text-base"
          >
            Book a Clean <ArrowRight size={16} />
          </a>
          <p className="text-center text-xs text-slate-600 mt-4">
            Multi-unit buildings — <a href="mailto:binpilotmimico@gmail.com" className="text-green-500 hover:underline">contact us for a quote</a>.
          </p>
        </div>
      </section>

      {/* ── Customer Pathway ── */}
      <section id="how-it-works" className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">How it works</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            From booking to clean bins — here&apos;s exactly what happens.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-green-500/40 via-green-500/20 to-transparent hidden sm:block" />

          <div className="space-y-6">
            {pathway.map((p, i) => (
              <div key={i} className="relative flex gap-6 items-start">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center z-10 ${p.bg}`}>
                  <p.icon size={20} className={p.color} />
                </div>
                <div className="flex-1 bg-white/[0.03] border border-white/8 rounded-2xl p-5 hover:border-white/12 transition-colors">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs font-bold ${p.color}`}>Step {p.step}</span>
                  </div>
                  <h3 className="font-bold text-base mb-1">{p.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Booking Form ── */}
      <section id="book" className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              Takes 60 seconds
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Book a Clean</h2>
            <p className="text-slate-400">
              Fill this out and Steve will confirm within a few hours.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-14 bg-green-500/10 border border-green-500/20 rounded-2xl px-8">
              <span className="text-5xl block mb-5">✅</span>
              <h3 className="text-2xl font-bold mb-3 text-green-400">You&apos;re booked in!</h3>
              <p className="text-slate-400 leading-relaxed">
                Thanks for booking. Steve will text or email you to confirm your scheduled clean within a few hours.
              </p>
              <p className="text-slate-500 text-sm mt-4">
                Questions? Text 519-729-3673 anytime.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Your Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-green-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    placeholder="416-555-0100"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-green-500/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="jane@email.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-green-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Street Address (Mimico or New Toronto) *</label>
                <input
                  required
                  type="text"
                  placeholder="123 Lakeshore Blvd W"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-green-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Which bins? (select all that apply) *</label>
                <div className="flex flex-wrap gap-3">
                  {binOptions.map((bin) => (
                    <button
                      key={bin}
                      type="button"
                      onClick={() => toggleBin(bin)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                        form.bins.includes(bin)
                          ? 'bg-green-500/20 border-green-500/50 text-green-400'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {bin}
                    </button>
                  ))}
                </div>
                {form.bins.length > 0 && (
                  <p className="text-xs text-green-400 mt-2">
                    {form.bins.length === 1 && 'Total: $25'}
                    {form.bins.length === 2 && 'Total: $40'}
                    {form.bins.length === 3 && 'Total: $50'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Anything else we should know?</label>
                <textarea
                  rows={3}
                  placeholder="e.g. bins are in the backyard, gate code is 1234..."
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-green-500/50 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || form.bins.length === 0}
                className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-colors text-base"
              >
                {submitting ? 'Sending...' : 'Book My Clean'}
              </button>

              <p className="text-center text-xs text-slate-600">
                Or text <span className="text-slate-400">BIN CLEAN</span> to <a href="sms:+15197293673&body=BIN CLEAN" className="text-green-500">519-729-3673</a>
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Why BinPilot</h2>
          <p className="text-slate-400 max-w-xl mx-auto">A local service, built for this neighbourhood.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {whyUs.map((w) => (
            <div
              key={w.title}
              className="bg-white/[0.03] border border-white/8 rounded-xl p-6 hover:border-green-500/25 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <w.icon size={18} className="text-green-400" />
              </div>
              <h3 className="font-semibold mb-2 text-sm">{w.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>

        {/* Bin types */}
        <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { icon: Trash2, label: 'Garbage Bin', color: 'text-slate-400' },
            { icon: Recycle, label: 'Recycling Bin', color: 'text-blue-400' },
            { icon: Leaf, label: 'Green Bin', color: 'text-green-400' },
          ].map((b) => (
            <div key={b.label} className="text-center bg-white/[0.03] border border-white/8 rounded-xl py-5 px-3">
              <b.icon size={24} className={`${b.color} mx-auto mb-2`} />
              <p className="text-xs text-slate-400">{b.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Questions</h2>
            <p className="text-slate-400">Everything you need to know before booking.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-sm pr-4">{f.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-400 text-sm leading-relaxed">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-28 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-green-500/8 rounded-full blur-[80px]" />
          </div>
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-5">Ready for clean bins?</h2>
            <p className="text-slate-400 text-lg mb-3 max-w-xl mx-auto">
              Join your Mimico and New Toronto neighbours. Limited spots available this week.
            </p>
            <p className="text-slate-500 text-sm mb-10">Thanks for supporting a local family. — Steve</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#book"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-xl text-base transition-colors"
              >
                Book Online
              </a>
              <a
                href="sms:+15197293673&body=BIN CLEAN"
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors"
              >
                <Phone size={16} />
                Text 519-729-3673
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center">
                <Trash2 size={13} className="text-white" />
              </div>
              <span className="font-bold tracking-tight">
                Bin<span className="text-green-400">Pilot</span>
              </span>
              <span className="text-slate-600 text-sm ml-2">Mimico Bin Cleaning</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500">
              <a href="sms:+15197293673&body=BIN CLEAN" className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                <Phone size={13} />
                519-729-3673
              </a>
              <a href="mailto:binpilotmimico@gmail.com" className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                <Mail size={13} />
                binpilotmimico@gmail.com
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} BinPilot — Mimico Bin Cleaning. Local neighbour. Serving Mimico &amp; New Toronto.
          </div>
        </div>
      </footer>
    </div>
  );
}
