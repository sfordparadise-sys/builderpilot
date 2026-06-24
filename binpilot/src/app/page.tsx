'use client';

import { useState, useEffect } from 'react';
import {
  Trash2,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  Leaf,
  Menu,
  X,
  ArrowRight,
  AlertTriangle,
  Recycle,
  Calendar,
  MessageSquare,
  Camera,
  RefreshCw,
  ShieldCheck,
  Heart,
  Bug,
  Skull,
  Sparkles,
  Send,
  Star,
} from 'lucide-react';

// Replace with your Formspree form ID after signing up at formspree.io
const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID';

// Garbage collection is Tuesday morning. We clean Tuesday PM or Wednesday.
// Suggest the next Wednesday (day after pickup = freshly empty bins).
function nextWednesday() {
  const d = new Date();
  const wd = d.getDay(); // 0 Sun ... 3 Wed
  let add = (3 - wd + 7) % 7;
  if (add === 0) add = 7; // if today is Wednesday, schedule next week
  d.setDate(d.getDate() + add);
  return d;
}

export default function BinPilotPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [serviceDate, setServiceDate] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    bins: [] as string[],
    plan: 'Monthly',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setServiceDate(
      nextWednesday().toLocaleDateString('en-CA', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  const navLinks = [
    { label: 'The Problem', href: '#problem' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Book', href: '#book' },
  ];

  const binOptions = ['Garbage', 'Recycling', 'Green Bin'];
  const priceFor = (n: number) => (n === 1 ? 25 : n === 2 ? 40 : n >= 3 ? 50 : 0);

  const threats = [
    { icon: Skull, label: 'E. coli & Salmonella', desc: 'The same bacteria behind food poisoning thrive in warm, rotting bin gunk.' },
    { icon: Bug, label: 'Flies & Maggots', desc: 'One forgotten chicken wrapper becomes a maggot nursery in 48 hours.' },
    { icon: Trash2, label: 'Raccoons & Skunks', desc: 'A stinky bin is a dinner bell. Once they find it, they keep coming back.' },
    { icon: Heart, label: 'Right Next to Your Family', desc: 'That bin sits by your garage, your kids, your pets, your back door.' },
  ];

  const pathway = [
    { icon: Send, step: '1', title: 'Book in 30 Seconds', desc: 'Tell us your address and which bins. We even pre-pick your clean date for you.', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { icon: MessageSquare, step: '2', title: 'Steve Confirms', desc: 'You get a quick text confirming your spot. A real local neighbour, not a call centre.', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { icon: Calendar, step: '3', title: 'We Clean After Pickup', desc: 'Bins go out Tuesday. Once they are empty, we hit them with a 200°F pressure wash right at your curb.', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { icon: Camera, step: '4', title: 'Proof in Your Inbox', desc: 'A before-and-after photo lands on your phone. Bins back in place. You did nothing.', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  const funFacts = [
    { emoji: '🦝', title: 'Raccoon Therapist Report', body: '"Patient: Your Garbage Bin. Symptoms: smells terrible, attracts bad influences, hoards garbage. Recommended treatment: professional cleaning, monthly."' },
    { emoji: '🚽', title: 'Grosser Than Your Toilet', body: 'Studies have found household garbage bins can harbour more bacteria per square inch than a toilet seat. You scrub one. You ignore the other.' },
    { emoji: '🏆', title: 'Raccoons Have Standards', body: 'Fun fact: raccoons have higher cleanliness standards than some homeowners. Even they think your bin is gross. Let us fix that.' },
  ];

  const faqs = [
    { q: 'How fast can you come?', a: `We clean on Wednesdays, right after your Tuesday pickup, so the bins are empty and easy to sanitize. Your next available clean is ${serviceDate || 'this coming Wednesday'}. Need it sooner? Text us.` },
    { q: 'Do I need to be home?', a: 'Nope. Leave your bins at the curb after collection and we handle the rest — cleaned, deodorized, and put back. We text you a photo when it is done.' },
    { q: 'Which bins do you clean?', a: 'All three: garbage, blue recycling, and green organics. Pick any combination when you book — $25 for one, $40 for two, $50 for all three.' },
    { q: 'Is it actually sanitary, or just rinsed?', a: 'We use 200°F high-pressure hot water that kills bacteria, mould, and odour on contact — inside and out. No garden-hose splash job. All wastewater is captured and disposed of responsibly.' },
    { q: 'What about winter?', a: 'We run year-round. Winter is when frozen organic gunk builds up worst, and our hot-water system powers right through the cold.' },
    { q: 'Can I cancel anytime?', a: 'Yes. The monthly plan has no contract — pause or cancel with a quick text, no fees, no guilt trip.' },
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
          plan: form.plan,
          requested_date: serviceDate,
          notes: form.notes,
        }),
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  const binCount = form.bins.length;
  const total = priceFor(binCount);

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

          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0a0f0a] px-4 py-4 space-y-3">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="block text-slate-300 hover:text-white py-1 text-sm" onClick={() => setMobileOpen(false)}>
                {l.label}
              </a>
            ))}
            <a href="#book" className="block mt-2 bg-green-500 text-black font-semibold text-sm px-4 py-2 rounded-lg text-center" onClick={() => setMobileOpen(false)}>
              Book Online
            </a>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-green-500/10 rounded-full blur-[130px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <MapPin size={12} />
            Mimico &amp; New Toronto&apos;s local bin cleaners
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.02] mb-6">
            Your bin is dirtier<br />
            than your <span className="text-green-400">toilet.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-9 leading-relaxed">
            And it&apos;s parked right next to your home, your kids, and your dog. We blast away the bacteria,
            the smell, the flies, and the raccoon buffet — with a 200°F pressure wash, right at your curb.
            You never touch it.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#book" className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-7 py-3.5 rounded-xl text-base transition-colors">
              Book My Clean <ArrowRight size={16} />
            </a>
            <a href="sms:+15197293673&body=BIN CLEAN" className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-colors">
              <Phone size={16} />
              Text BIN CLEAN
            </a>
          </div>

          {serviceDate && (
            <div className="mt-5 inline-flex items-center gap-2 text-sm text-green-400/90">
              <Calendar size={14} />
              Next available clean: <span className="font-semibold">{serviceDate}</span>
            </div>
          )}

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-500">
            <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-green-400" /><span>200°F sanitizing wash</span></div>
            <div className="w-px h-4 bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-400" /><span>No hauling, no hose, no effort</span></div>
            <div className="w-px h-4 bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-1.5"><Heart size={14} className="text-green-400" /><span>Local family — supporting local</span></div>
          </div>
        </div>
      </section>

      {/* ── The Problem (agitate) ── */}
      <section id="problem" className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <AlertTriangle size={12} />
              Warning: you probably haven&apos;t looked inside lately
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">What&apos;s actually living in there</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Most homeowners never look inside their bin — until the smell hits. Here&apos;s what you&apos;re storing a few feet from your front door.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {threats.map((t) => (
              <div key={t.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-6 hover:border-amber-500/25 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                  <t.icon size={18} className="text-amber-400" />
                </div>
                <h3 className="font-semibold mb-2 text-sm">{t.label}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 sm:p-8 text-center max-w-3xl mx-auto">
            <Sparkles size={22} className="text-green-400 mx-auto mb-3" />
            <p className="text-lg sm:text-xl font-semibold mb-1">Your bin doesn&apos;t have to be a biohazard.</p>
            <p className="text-slate-400 text-sm">One clean and the smell, the bugs, and the bacteria are gone. Then we keep it that way.</p>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            Neighbourhood Intro Offer
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">What you get</h2>
          <p className="text-slate-400">Every clean includes everything. No tiers, no upsells, no surprises.</p>
        </div>

        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8 mb-6">
          <ul className="space-y-4">
            {[
              { emoji: '🔥', text: '200°F high-pressure hot wash — inside and out' },
              { emoji: '🦠', text: 'Kills bacteria, mould & odour — proper sanitizing, not a rinse' },
              { emoji: '🗑️', text: 'Any bins you want — garbage, recycling, green' },
              { emoji: '🏠', text: 'Done right at your curb — zero hauling, zero effort' },
              { emoji: '📸', text: 'Before & after photo texted to you when done' },
            ].map((item) => (
              <li key={item.text} className="flex items-start gap-3 text-slate-300 text-sm">
                <span className="text-xl leading-none mt-0.5">{item.emoji}</span>
                <span className="leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { bins: '1 Bin', price: '$25' },
            { bins: '2 Bins', price: '$40', highlight: true },
            { bins: '3 Bins', price: '$50' },
          ].map((p) => (
            <div key={p.bins} className={`rounded-2xl p-5 text-center ${p.highlight ? 'bg-green-500/10 border-2 border-green-500/40' : 'bg-white/[0.03] border border-white/8'}`}>
              <span className="text-slate-400 text-xs font-medium block mb-1">{p.bins}</span>
              <span className="text-3xl font-extrabold">{p.price}</span>
            </div>
          ))}
        </div>

        <a href="#book" className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl transition-colors text-base">
          Book a Clean <ArrowRight size={16} />
        </a>
        <p className="text-center text-xs text-slate-600 mt-4">
          Multi-unit buildings — <a href="mailto:binpilotmimico@gmail.com" className="text-green-500 hover:underline">contact us for a quote</a>.
        </p>
      </section>

      {/* ── Booking (the star) ── */}
      <section id="book" className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              30 seconds, 3 taps
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Book your clean</h2>
            <p className="text-slate-400">We already picked the best date. Just confirm your details.</p>
          </div>

          {submitted ? (
            <div className="text-center py-14 bg-green-500/10 border border-green-500/20 rounded-2xl px-8">
              <span className="text-5xl block mb-5">🎉</span>
              <h3 className="text-2xl font-bold mb-3 text-green-400">You&apos;re booked in!</h3>
              <p className="text-slate-300 leading-relaxed">
                We&apos;ve got you down for <span className="font-semibold">{serviceDate}</span>. Steve will text you shortly to confirm.
              </p>
              <p className="text-slate-500 text-sm mt-4">Questions? Text 519-729-3673 anytime.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Pre-filled date banner */}
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-4">
                <Calendar size={20} className="text-green-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-slate-400">Your clean date (right after Tuesday pickup)</p>
                  <p className="font-semibold text-green-400">{serviceDate || 'This coming Wednesday'}</p>
                </div>
                <span className="text-xs text-slate-500 hidden sm:block">We&apos;ll confirm by text</span>
              </div>

              {/* Step 1: bins */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">1. Which bins need help?</label>
                <div className="grid grid-cols-3 gap-3">
                  {binOptions.map((bin) => (
                    <button
                      key={bin}
                      type="button"
                      onClick={() => toggleBin(bin)}
                      className={`px-3 py-3.5 rounded-xl text-sm font-medium border transition-colors ${
                        form.bins.includes(bin)
                          ? 'bg-green-500/20 border-green-500/50 text-green-400'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {bin}
                    </button>
                  ))}
                </div>
                {binCount > 0 && (
                  <p className="text-sm text-green-400 mt-2 font-semibold">Total: ${total}{form.plan === 'Monthly' ? '/clean' : ''}</p>
                )}
              </div>

              {/* Step 2: plan */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">2. How often?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'Monthly', label: 'Monthly', sub: 'Best value · never think about it' },
                    { id: 'One-Time', label: 'One-Time', sub: 'Just this once' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, plan: opt.id }))}
                      className={`px-4 py-3 rounded-xl text-left border transition-colors ${
                        form.plan === opt.id
                          ? 'bg-green-500/20 border-green-500/50'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className={`block text-sm font-semibold ${form.plan === opt.id ? 'text-green-400' : 'text-slate-300'}`}>{opt.label}</span>
                      <span className="block text-xs text-slate-500 mt-0.5">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: details */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">3. Where do we come?</label>
                <div className="space-y-3">
                  <input
                    required
                    type="text"
                    placeholder="Street address (Mimico / New Toronto)"
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-green-500/50 transition-colors"
                  />
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      required
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-green-500/50 transition-colors"
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Mobile (for your confirmation)"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-green-500/50 transition-colors"
                    />
                  </div>

                  {showNotes ? (
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Email (optional)"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-green-500/50 transition-colors"
                      />
                      <textarea
                        rows={2}
                        placeholder="Gate code, where the bins are, a different day you'd prefer..."
                        value={form.notes}
                        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-green-500/50 transition-colors resize-none"
                      />
                    </div>
                  ) : (
                    <button type="button" onClick={() => setShowNotes(true)} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                      + Add email or a note (gate code, preferred day)
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || binCount === 0}
                className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-colors text-base"
              >
                {submitting ? 'Sending...' : binCount === 0 ? 'Pick your bins above' : `Book My Clean — $${total}`}
              </button>

              <p className="text-center text-xs text-slate-600">
                Prefer to text? Send <span className="text-slate-400">BIN CLEAN</span> to{' '}
                <a href="sms:+15197293673&body=BIN CLEAN" className="text-green-500">519-729-3673</a>
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">How it works</h2>
          <p className="text-slate-400 max-w-xl mx-auto">From booking to spotless bins — and you lift exactly nothing.</p>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-green-500/40 via-green-500/20 to-transparent hidden sm:block" />
          <div className="space-y-6">
            {pathway.map((p, i) => (
              <div key={i} className="relative flex gap-6 items-start">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center z-10 ${p.bg}`}>
                  <p.icon size={20} className={p.color} />
                </div>
                <div className="flex-1 bg-white/[0.03] border border-white/8 rounded-2xl p-5 hover:border-white/12 transition-colors">
                  <span className={`text-xs font-bold ${p.color}`}>Step {p.step}</span>
                  <h3 className="font-bold text-base mb-1 mt-1">{p.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Before / After ── */}
      <section className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">See the difference</h2>
            <p className="text-slate-400 max-w-xl mx-auto">The look on your bin&apos;s face says it all.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl overflow-hidden border border-red-500/20 bg-white/[0.02]">
              <div className="bg-red-500/10 px-5 py-3 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-red-400 font-semibold text-sm tracking-wide uppercase">Before</span>
              </div>
              <div className="aspect-[4/3] flex items-center justify-center p-8 text-center">
                <div>
                  <span className="text-5xl block mb-4">🤢</span>
                  <p className="text-slate-500 text-sm leading-relaxed">Mould, maggots, mystery liquid, and a smell that follows you inside.</p>
                  <p className="mt-4 text-slate-700 text-xs italic">Your photo here soon</p>
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
                  <p className="text-slate-400 text-sm leading-relaxed">Sanitized, deodorized, and fresh. Bugs gone. Smell gone. Done at your curb.</p>
                  <p className="mt-4 text-slate-700 text-xs italic">Your photo here soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fun facts (humor) ── */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            From the BinPilot files
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Three things about your bin</h2>
          <p className="text-slate-400 max-w-xl mx-auto">We promise these are funnier than they are gross. Barely.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {funFacts.map((f) => (
            <div key={f.title} className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-green-500/25 transition-colors">
              <span className="text-4xl block mb-4">{f.emoji}</span>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="#book" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-7 py-3.5 rounded-xl transition-colors">
            Okay, clean my bins <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* ── Bin types strip ── */}
      <section className="py-12 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-lg mx-auto px-4 sm:px-6 grid grid-cols-3 gap-4">
          {[
            { icon: Trash2, label: 'Garbage', color: 'text-slate-400' },
            { icon: Recycle, label: 'Recycling', color: 'text-blue-400' },
            { icon: Leaf, label: 'Green Bin', color: 'text-green-400' },
          ].map((b) => (
            <div key={b.label} className="text-center">
              <b.icon size={26} className={`${b.color} mx-auto mb-2`} />
              <p className="text-xs text-slate-400">{b.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Questions</h2>
          <p className="text-slate-400">Everything you need to know before booking.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
              <button className="w-full flex items-center justify-between px-6 py-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="font-medium text-sm pr-4">{f.q}</span>
                <ChevronDown size={16} className={`text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5">
                  <p className="text-slate-400 text-sm leading-relaxed">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-28 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-green-500/8 rounded-full blur-[80px]" />
          </div>
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-5">Your bin is waiting.<br />Sadly.</h2>
            <p className="text-slate-400 text-lg mb-3 max-w-xl mx-auto">
              Join your Mimico and New Toronto neighbours who never deal with a gross bin again. Limited spots this week.
            </p>
            <p className="text-slate-500 text-sm mb-10">Thanks for supporting a local family. — Steve</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#book" className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-xl text-base transition-colors">
                Book Online <ArrowRight size={16} />
              </a>
              <a href="sms:+15197293673&body=BIN CLEAN" className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors">
                <Phone size={16} />
                Text 519-729-3673
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10 pb-28 md:pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center">
                <Trash2 size={13} className="text-white" />
              </div>
              <span className="font-bold tracking-tight">Bin<span className="text-green-400">Pilot</span></span>
              <span className="text-slate-600 text-sm ml-2">Mimico Bin Cleaning</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500">
              <a href="sms:+15197293673&body=BIN CLEAN" className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                <Phone size={13} />519-729-3673
              </a>
              <a href="mailto:binpilotmimico@gmail.com" className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                <Mail size={13} />binpilotmimico@gmail.com
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} BinPilot — Mimico Bin Cleaning. Local neighbour. Serving Mimico &amp; New Toronto.
          </div>
        </div>
      </footer>

      {/* ── Sticky mobile book bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0f0a]/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex gap-3">
        <a href="sms:+15197293673&body=BIN CLEAN" className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 text-white font-semibold text-sm py-3 rounded-xl">
          <Phone size={15} /> Text
        </a>
        <a href="#book" className="flex-[1.5] inline-flex items-center justify-center gap-1.5 bg-green-500 text-black font-bold text-sm py-3 rounded-xl">
          Book My Clean
        </a>
      </div>
    </div>
  );
}
