'use client';

import { useState, useEffect } from 'react';
import { useForm } from '@formspree/react';
import {
  Trash2, CheckCircle, Phone, Mail, ChevronDown,
  Leaf, Menu, X, ArrowRight, AlertTriangle, Recycle,
  Calendar, MessageSquare, Camera, ShieldCheck,
  Heart, Bug, Skull, Sparkles, Send, Star, Zap,
} from 'lucide-react';

function nextWednesday() {
  const d = new Date();
  const wd = d.getDay();
  let add = (3 - wd + 7) % 7;
  if (add === 0) add = 7;
  d.setDate(d.getDate() + add);
  return d;
}

const MARQUEE_TEXT = '🦝 LIMITED SPOTS THIS WEEK   ·   GARBAGE DAY IS TUESDAY   ·   WE CLEAN WEDNESDAY   ·   MIMICO & NEW TORONTO   ·   TEXT BIN CLEAN TO 519-729-3673   ·   ';

export default function BinPilotPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [serviceDate, setServiceDate] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [spotsLeft] = useState(() => Math.floor(Math.random() * 3) + 2);
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '', bins: [] as string[], plan: 'Monthly', notes: '' });
  const [fpState, fpSubmit] = useForm('xzdlepgr');

  useEffect(() => {
    setServiceDate(nextWednesday().toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' }));
  }, []);

  // Cute raccoon scarcity popup — pops up once per visit after a short delay.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try { if (sessionStorage.getItem('binpilot_popup_seen')) return; } catch {}
    const t = setTimeout(() => setShowPopup(true), 6000);
    return () => clearTimeout(t);
  }, []);

  function dismissPopup() {
    setShowPopup(false);
    try { sessionStorage.setItem('binpilot_popup_seen', '1'); } catch {}
  }

  // Scroll-reveal: progressive enhancement. Adds .js-reveal so [data-reveal]
  // elements fade up as they enter the viewport; if JS never runs, content
  // stays fully visible (the class is only added here).
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('js-reveal');
    const els = Array.from(document.querySelectorAll('[data-reveal]'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    // Failsafe: never leave a section hidden if the observer doesn't fire.
    const failsafe = setTimeout(() => {
      document.querySelectorAll('[data-reveal]:not(.in-view)').forEach((e) => e.classList.add('in-view'));
    }, 3500);
    return () => { io.disconnect(); clearTimeout(failsafe); };
  }, []);

  const navLinks = [
    { label: 'The Problem', href: '#problem' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Book', href: '#book' },
    { label: 'FAQ', href: '#faq' },
  ];

  const binOptions = ['Garbage', 'Recycling', 'Green Bin'];
  const priceFor = (n: number) => n === 1 ? 25 : n === 2 ? 40 : n >= 3 ? 50 : 0;

  const threats = [
    { icon: Skull,  label: 'E. coli & Salmonella',      desc: 'Food-poisoning bacteria thrive in warm bin gunk — and your kids touch that lid.' },
    { icon: Bug,    label: 'Flies, Maggots & Wasps',    desc: 'A forgotten wrapper becomes a maggot nursery in 48 hours.' },
    { icon: Trash2, label: 'Raccoons & Skunks',         desc: 'A stinky bin is a dinner bell — and they tell their friends.' },
    { icon: Heart,  label: 'Parked Next to Your Family', desc: 'It sits by your garage, your dog, your kids. Closer than you think.' },
  ];

  const testimonials = [
    { name: 'Jennifer M.',      street: 'Mimico Ave',        text: 'I was embarrassed to admit how bad our green bin was. One clean and the smell was just — gone. Steve texted me a before/after photo and I actually gasped.',                          stars: 5 },
    { name: 'Dave & Karen T.', street: 'Lake Shore Blvd W', text: 'We had raccoons tipping our bins every single week. Since Steve started cleaning them monthly, they haven\'t touched them once. Worth every dollar.',                              stars: 5 },
    { name: 'Priya S.',         street: 'New Toronto',       text: 'Booked online in like two minutes. He showed up Wednesday, did all three bins while I was at work, and sent me a photo. I didn\'t have to do anything. Incredible.', stars: 5 },
  ];

  const pathway = [
    { icon: Send,          step: '1', title: 'Book in 30 Seconds',        desc: 'Pick your bins, choose monthly or one-time, drop your address. Done. We pre-fill your clean date.',            color: 'text-teal-400',   bg: 'bg-teal-500/10 border-teal-500/20' },
    { icon: MessageSquare, step: '2', title: 'Steve Texts You Back',       desc: 'A real local neighbour confirms your spot — not a call centre, not a chatbot.',                               color: 'text-sky-400',    bg: 'bg-sky-500/10 border-sky-500/20' },
    { icon: Calendar,      step: '3', title: 'Wednesday: We Come to You', desc: 'Bins emptied Tuesday. We arrive Wednesday and hit them with a 200°F pressure wash right at your curb.',       color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { icon: Camera,        step: '4', title: 'Before & After Photo',       desc: 'Proof on your phone. Bins back in place. You didn\'t lift a finger or a hose.',                               color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  ];

  const faqs = [
    { q: 'How fast can you come?',         a: `We clean every Wednesday — right after Tuesday's pickup so bins are empty and ready. Your next available date is ${serviceDate || 'this Wednesday'}. Need it faster? Text us.` },
    { q: 'Do I need to be home?',          a: 'Not at all. Leave your bins out after Tuesday collection and we take care of everything. You get a before/after photo when it\'s done, bins back in place.' },
    { q: 'Which bins do you clean?',       a: 'All three City of Toronto bins: garbage, blue recycling, and green organics. Pick any combo — $25 for one, $40 for two, $50 for all three.' },
    { q: 'Is it a real sanitizing wash?',  a: 'Yes — 200°F high-pressure hot water, inside and out. Not a garden-hose rinse. Kills bacteria, mould, and odour on contact. All wastewater is captured and disposed of properly.' },
    { q: 'What about winter?',             a: 'Year-round. Frozen organic gunk builds up worst in winter and our hot-water system powers right through the cold.' },
    { q: 'Can I cancel the monthly plan?', a: 'Anytime. Text us, no fees, no guilt trip, no forms to sign. We\'re neighbours — we\'re not going to hold your bin hostage.' },
  ];

  function toggleBin(bin: string) {
    setForm(f => ({ ...f, bins: f.bins.includes(bin) ? f.bins.filter(b => b !== bin) : [...f.bins, bin] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fpSubmit({ ...form, bins: form.bins.join(', '), requested_date: serviceDate });
  }

  const binCount = form.bins.length;
  const total = priceFor(binCount);

  return (
    <div className="min-h-screen bg-[#04080f] text-white">

      {/* ── Marquee ── */}
      <div className="bg-gradient-to-r from-teal-700 via-cyan-600 to-teal-700 text-white text-xs font-bold overflow-hidden py-2">
        <div className="flex animate-marquee whitespace-nowrap">
          {[1, 2].map(k => (
            <span key={k} className="flex items-center">{MARQUEE_TEXT.repeat(4)}</span>
          ))}
        </div>
      </div>

      {/* ── Nav ── */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-[#04080f]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <a href="#" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
              <Trash2 size={14} className="text-white" />
            </div>
            <span className="font-bold tracking-tight">Bin<span className="text-teal-400">Pilot</span></span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            {navLinks.map(l => <a key={l.label} href={l.href} className="hover:text-white transition-colors">{l.label}</a>)}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-orange-400 font-medium">
              <span className="live-dot w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
              {spotsLeft} spots left
            </div>
            <a href="#book" className="glow-pulse-orange bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all">
              Book Online
            </a>
          </div>

          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#04080f] px-4 py-4 space-y-3">
            {navLinks.map(l => (
              <a key={l.label} href={l.href} className="block text-slate-300 hover:text-white py-1 text-sm" onClick={() => setMobileOpen(false)}>{l.label}</a>
            ))}
            <a href="#book" className="block mt-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm px-4 py-2.5 rounded-lg text-center" onClick={() => setMobileOpen(false)}>
              Book Online — {spotsLeft} spots left
            </a>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="relative flex items-center justify-center overflow-hidden pt-16 pb-12 sm:pt-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-teal-500/10 rounded-full blur-[160px]" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-cyan-500/6 rounded-full blur-[110px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center fade-in-up">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-7 tracking-wide">
            <span className="live-dot w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
            ONLY {spotsLeft} SPOTS LEFT THIS WEEK &nbsp;·&nbsp; MIMICO &amp; NEW TORONTO
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[0.95] mb-7">
            Your bin is dirtier<br />than your{' '}
            <span className="shimmer-text">toilet.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-xl mx-auto mb-9 leading-relaxed">
            A 200°F pressure wash at your curb — bacteria, smell and flies gone.
            <strong className="text-white"> You never touch it.</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-7">
            <a href="#book" className="glow-pulse-orange inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black px-8 py-4 rounded-xl text-lg transition-all">
              Book My Clean <ArrowRight size={18} />
            </a>
            <a href="sms:+15197293673&body=BIN CLEAN" className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors">
              <Phone size={18} /> Text BIN CLEAN
            </a>
          </div>

          {serviceDate && (
            <div className="inline-flex items-center gap-2 text-sm font-medium text-teal-400 bg-teal-500/10 border border-teal-500/20 px-4 py-2 rounded-full">
              <Calendar size={14} />
              Next clean: <span className="font-bold">{serviceDate}</span> — right after Tuesday pickup
            </div>
          )}

          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
            <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-teal-400" /><span>200°F sanitizing wash</span></div>
            <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-teal-400" /><span>Zero effort on your part</span></div>
            <div className="flex items-center gap-1.5"><Heart size={14} className="text-teal-400" /><span>Local family — Steve lives here</span></div>
          </div>

          {/* Real before/after proof, right up top */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              { src: '/photos/ba-1-blue-black.jpeg', cap: 'Recycling & garbage' },
              { src: '/photos/ba-3-green.jpeg',      cap: 'Green bin' },
            ].map((p) => (
              <figure key={p.src} className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
                <img src={p.src} alt="A bin before and after a 200°F sanitizing clean" className="w-full h-full object-cover" />
                <span className="absolute top-2.5 left-2.5 bg-[#04080f]/80 backdrop-blur-sm border border-white/15 text-white text-[9px] font-black tracking-widest px-2 py-1 rounded">BEFORE → AFTER</span>
                <span className="absolute bottom-2.5 right-2.5 bg-[#04080f]/70 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded">{p.cap}</span>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Raccoon Inspection Failed ── */}
      <section className="py-6 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-orange-950/40 border-2 border-orange-500/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <img src="/raccoons/inspector.png" alt="Cartoon raccoon inspector in a hi-vis vest" loading="lazy"
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl bg-white/90 border border-orange-500/30" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded tracking-widest">⚠ RACCOON INSPECTION FAILED</span>
            </div>
            <h3 className="font-black text-xl text-orange-300 mb-1">Property Address: <span className="text-white">Yours</span></h3>
            <p className="text-orange-200/70 text-sm mb-3">Suspicious smell · excessive grime · fly traffic over the legal limit.</p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-teal-500/15 border border-teal-500/30 text-teal-400 px-3 py-1.5 rounded-lg font-semibold">✓ A cleaner neighbourhood</span>
              <span className="bg-teal-500/15 border border-teal-500/30 text-teal-400 px-3 py-1.5 rounded-lg font-semibold">✓ A happier you</span>
              <span className="bg-teal-500/15 border border-teal-500/30 text-teal-400 px-3 py-1.5 rounded-lg font-semibold">✓ Less raccoon activity</span>
            </div>
          </div>
          <div className="flex-shrink-0 text-center">
            <p className="text-xs text-orange-400/60 mb-2 font-semibold">RECOMMENDED TREATMENT</p>
            <a href="#book" className="inline-flex flex-col items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black px-5 py-3 rounded-xl transition-all">
              <span className="text-base">Fix This</span>
              <span className="text-xs font-bold opacity-80">from $25</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section id="problem" className="py-20 bg-white/[0.02] border-y border-white/5 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide">
              <AlertTriangle size={12} /> YOU PROBABLY HAVEN&apos;T LOOKED INSIDE LATELY
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-3">What&apos;s actually living in there</h2>
            <p className="text-slate-400 max-w-xl mx-auto">A few feet from your front door. Right next to where your family lives.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {threats.map(t => (
              <div key={t.label} className="bg-white/[0.03] border border-red-500/10 rounded-xl p-6 hover:border-red-500/25 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                  <t.icon size={18} className="text-red-400" />
                </div>
                <h3 className="font-bold mb-2 text-sm">{t.label}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-6 sm:p-8 text-center max-w-3xl mx-auto">
            <Sparkles size={22} className="text-teal-400 mx-auto mb-3" />
            <p className="text-lg sm:text-xl font-bold mb-1">Your bin doesn&apos;t have to be a biohazard.</p>
            <p className="text-slate-400 text-sm mb-5">One clean and the smell, the bugs, and the bacteria are gone. We keep it that way.</p>
            <a href="#book" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold px-6 py-3 rounded-xl transition-all">
              Fix it now — from $25 <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide">
            NEIGHBOURHOOD INTRO OFFER
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-3">What you get</h2>
          <p className="text-slate-400">Every clean includes everything. No tiers, no upsells, no fine print.</p>
        </div>

        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8 mb-6">
          <ul className="space-y-4">
            {[
              { e: '🔥', t: '200°F high-pressure hot wash — inside and out' },
              { e: '🦠', t: 'Kills bacteria, mould & odour — not a rinse job' },
              { e: '🗑️', t: 'Any bins — garbage, recycling, green' },
              { e: '🏠', t: 'Done right at your curb — no hauling, ever' },
              { e: '📸', t: 'Before & after photo texted to you when done' },
            ].map(item => (
              <li key={item.t} className="flex items-start gap-3 text-slate-300 text-sm">
                <span className="text-xl leading-none mt-0.5">{item.e}</span>
                <span className="leading-relaxed">{item.t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { bins: '1 Bin',  price: '$25' },
            { bins: '2 Bins', price: '$40', highlight: true },
            { bins: '3 Bins', price: '$50' },
          ].map(p => (
            <div key={p.bins} className={`rounded-2xl p-5 text-center ${p.highlight ? 'bg-teal-500/10 border-2 border-teal-500/40' : 'bg-white/[0.03] border border-white/8'}`}>
              <span className="text-slate-400 text-xs font-medium block mb-1">{p.bins}</span>
              <span className="text-3xl font-black">{p.price}</span>
            </div>
          ))}
        </div>

        <a href="#book" className="glow-pulse-orange flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black py-4 rounded-xl transition-all text-base">
          Book a Clean <ArrowRight size={16} />
        </a>
        <p className="text-center text-xs text-slate-600 mt-4">
          Multi-unit buildings — <a href="mailto:binpilotmimico@gmail.com" className="text-teal-500 hover:underline">email us for a quote</a>.
        </p>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-3">Your neighbours already love it</h2>
            <p className="text-slate-400">Real results from real Mimico and New Toronto homes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 flex flex-col">
                <div className="flex mb-3">
                  {[...Array(t.stars)].map((_, s) => <Star key={s} size={14} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.street}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Smart Booking ── */}
      <section id="book" className="py-20 max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide">
            <Zap size={11} /> 30 SECONDS · 3 TAPS · DONE
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-3">Book your clean</h2>
          <p className="text-slate-400">We already picked your date. Just confirm the details.</p>
        </div>

        {fpState.succeeded ? (
          <div className="text-center py-14 bg-teal-500/10 border border-teal-500/20 rounded-2xl px-8">
            <span className="text-5xl block mb-5">🎉</span>
            <h3 className="text-2xl font-black mb-3 text-teal-400">You&apos;re in!</h3>
            <p className="text-slate-300 leading-relaxed">
              Booked for <span className="font-bold">{serviceDate}</span>. Steve will text you shortly to confirm your spot.
            </p>
            <p className="text-slate-500 text-sm mt-4">Questions? Text 519-729-3673 anytime.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-3 bg-teal-500/10 border border-teal-500/30 rounded-xl px-5 py-4">
              <Calendar size={20} className="text-teal-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-slate-400">Your clean date — right after Tuesday pickup</p>
                <p className="font-bold text-teal-400 text-lg">{serviceDate || 'This Wednesday'}</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-500">Spots remaining</p>
                <p className="text-orange-400 font-black text-xl count-up">{spotsLeft}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">1. Which bins?</label>
              <div className="grid grid-cols-3 gap-3">
                {binOptions.map(bin => (
                  <button key={bin} type="button" onClick={() => toggleBin(bin)}
                    className={`py-3.5 rounded-xl text-sm font-bold border transition-all ${form.bins.includes(bin) ? 'bg-teal-500/20 border-teal-500/50 text-teal-400 scale-[1.02]' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/25'}`}>
                    {bin}
                  </button>
                ))}
              </div>
              {binCount > 0 && (
                <p className="text-teal-400 font-black text-lg mt-2 count-up">${total} total{form.plan === 'Monthly' ? ' per clean' : ''}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">2. How often?</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'Monthly',  label: 'Monthly',  sub: 'Best value · never think about it again' },
                  { id: 'One-Time', label: 'One-Time', sub: 'Just this once' },
                ].map(opt => (
                  <button key={opt.id} type="button" onClick={() => setForm(f => ({ ...f, plan: opt.id }))}
                    className={`px-4 py-3.5 rounded-xl text-left border transition-all ${form.plan === opt.id ? 'bg-teal-500/20 border-teal-500/50 scale-[1.01]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                    <span className={`block text-sm font-bold ${form.plan === opt.id ? 'text-teal-400' : 'text-slate-300'}`}>{opt.label}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">{opt.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">3. Where?</label>
              <div className="space-y-3">
                <input required type="text" placeholder="Street address (Mimico or New Toronto)" value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 transition-colors" />
                <div className="grid sm:grid-cols-2 gap-3">
                  <input required type="text" placeholder="Your name" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 transition-colors" />
                  <input required type="tel" placeholder="Mobile number" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 transition-colors" />
                </div>
                {showNotes ? (
                  <div className="space-y-3">
                    <input type="email" placeholder="Email (optional — for confirmation)" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 transition-colors" />
                    <textarea rows={2} placeholder="Gate code, where bins live, different preferred day..."
                      value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 transition-colors resize-none" />
                  </div>
                ) : (
                  <button type="button" onClick={() => setShowNotes(true)} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                    + Add a note (gate code, email, different day)
                  </button>
                )}
              </div>
            </div>

            <button type="submit" disabled={fpState.submitting || binCount === 0}
              className="glow-pulse-orange w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all text-lg">
              {fpState.submitting ? 'Booking...' : binCount === 0 ? 'Tap your bins above to start' : `Book My Clean — $${total}`}
            </button>

            <p className="text-center text-xs text-slate-600">
              Rather text? Send <span className="text-slate-400 font-bold">BIN CLEAN</span> to{' '}
              <a href="sms:+15197293673&body=BIN CLEAN" className="text-teal-500 font-bold">519-729-3673</a>
            </p>
          </form>
        )}
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14" data-reveal>
            <h2 className="text-3xl sm:text-4xl font-black mb-3">How it works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">From booking to spotless bins — and you lift exactly nothing.</p>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-teal-500/40 via-teal-500/20 to-transparent hidden sm:block" />
            <div className="space-y-5">
              {pathway.map((p, i) => (
                <div key={i} className="relative flex gap-5 items-start">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center z-10 ${p.bg}`}>
                    <p.icon size={20} className={p.color} />
                  </div>
                  <div className="flex-1 bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                    <span className={`text-xs font-black ${p.color} tracking-widest`}>STEP {p.step}</span>
                    <h3 className="font-black text-base mb-1 mt-1">{p.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Illustrated process strip ── */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10" data-reveal>
          <h2 className="text-3xl sm:text-4xl font-black mb-3">The 200°F process</h2>
          <p className="text-slate-400">Five steps. You do exactly none of them.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4" data-reveal>
          {[
            { img: '/process/1-pretreat.webp', label: 'Pre-treat' },
            { img: '/process/2-scrub.webp',    label: 'Scrub' },
            { img: '/process/3-rinse.webp',    label: 'Rinse' },
            { img: '/process/4-pressure.webp', label: '200°F wash' },
            { img: '/process/5-spotless.webp', label: 'Spotless' },
          ].map((s, i) => (
            <div key={s.label} className="text-center">
              <div className="rounded-2xl bg-white border border-white/10 p-2 mb-3 aspect-square flex items-center justify-center overflow-hidden">
                <img src={s.img} alt={s.label} loading="lazy" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs font-black text-teal-400 tracking-widest">STEP {i + 1}</span>
              <p className="text-sm font-bold text-slate-200">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Real before/after gallery ── */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12" data-reveal>
          <h2 className="text-3xl sm:text-4xl font-black mb-3">See the difference</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Real bins, real homes. The same bin — before, and after our 200°F sanitizing clean.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            { src: '/photos/ba-1-blue-black.jpeg', cap: 'Recycling & garbage bins — caked-on gunk gone in a single pass.' },
            { src: '/photos/ba-3-green.jpeg',      cap: 'Green bin — months of rotting organics, lifted right out.' },
            { src: '/photos/ba-4-green.jpeg',      cap: 'Years of buildup sanitized back to factory-clean.' },
            { src: '/photos/ba-2-green.jpeg',      cap: 'No scrubbing, no smell — just a bin you can stand next to.' },
          ].map((p) => (
            <figure key={p.src} data-reveal className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
              <div className="relative">
                <img src={p.src} alt="A bin shown before and after a 200°F sanitizing clean" loading="lazy" className="w-full h-auto block" />
                <span className="absolute top-3 left-3 bg-[#04080f]/80 backdrop-blur-sm border border-white/15 text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded">BEFORE → AFTER</span>
              </div>
              <figcaption className="px-5 py-3.5 text-sm text-slate-400">{p.cap}</figcaption>
            </figure>
          ))}
        </div>
        <p className="text-center text-xs text-slate-600 mt-6">Actual results from bins we&apos;ve cleaned. Your bin&apos;s glow-up is one tap away.</p>
      </section>

      {/* ── Fun facts ── */}
      <section className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12" data-reveal>
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide">
              FROM THE BINPILOT FILES
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-3">Three things you can&apos;t un-know</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-10" data-reveal>
            {[
              { img: '/raccoons/therapist.png',  title: 'Therapist Report', body: 'Patient: your garbage bin. Smells terrible, attracts bad influences. Prescription: a monthly clean.' },
              { img: '/raccoons/ewgross.png',     title: 'Grosser Than Your Toilet', body: 'A bin can hold more bacteria per inch than a toilet seat. You scrub one of those. Not the other.' },
              { img: '/raccoons/sunglasses.png',  title: 'Even Raccoons Judge You', body: 'The local raccoons think your bin is gross. Let’s fix that.' },
            ].map(f => (
              <div key={f.title} className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-teal-500/20 transition-colors">
                <img src={f.img} alt="" loading="lazy" className="w-20 h-20 object-cover rounded-xl bg-white/90 mb-4" />
                <h3 className="font-black mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <a href="#book" className="glow-pulse-orange inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black px-8 py-4 rounded-xl text-base transition-all">
              Okay, clean my bins <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Bin types ── */}
      <section className="py-12 max-w-lg mx-auto px-4 sm:px-6 grid grid-cols-3 gap-4">
        {[
          { icon: Trash2,  label: 'Garbage',   color: 'text-slate-400' },
          { icon: Recycle, label: 'Recycling',  color: 'text-sky-400' },
          { icon: Leaf,    label: 'Green Bin',  color: 'text-teal-400' },
        ].map(b => (
          <div key={b.label} className="text-center bg-white/[0.03] border border-white/8 rounded-xl py-5 px-3">
            <b.icon size={24} className={`${b.color} mx-auto mb-2`} />
            <p className="text-xs text-slate-400">{b.label}</p>
          </div>
        ))}
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14" data-reveal>
            <h2 className="text-3xl sm:text-4xl font-black mb-3">Questions</h2>
            <p className="text-slate-400">Everything you need before you book.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
                <button className="w-full flex items-center justify-between px-6 py-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-sm pr-4">{f.q}</span>
                  <ChevronDown size={16} className={`text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <div className="px-6 pb-5"><p className="text-slate-400 text-sm leading-relaxed">{f.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet Steve (local trust) ── */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div data-reveal className="bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/20 rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-7">
          <div className="flex-shrink-0 w-full sm:w-44 space-y-3">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-2xl overflow-hidden bg-teal-500/15 border border-teal-500/25 flex items-center justify-center">
              <img src="/steve.jpg" alt="Steve, owner of Mimico Bin Cleaning" loading="lazy"
                className="absolute inset-0 z-10 w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              <Heart size={40} className="text-teal-400" />
            </div>
            <img src="/photos/steve-builder.jpeg" alt="Steve on a local build site" loading="lazy"
              className="hidden sm:block w-44 h-28 object-cover rounded-xl border border-white/10"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 tracking-wide">
              <Heart size={12} /> YOUR NEIGHBOUR, NOT A FRANCHISE
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-3">Hi, I&apos;m Steve.</h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
              One Saturday in 2021, our realtor told us to drive down Lake Shore and turn right
              on any street past Hillside. We did — and fell in love on the spot. This is a
              white-picket-fence kind of place: kids running around, neighbours having a drink
              on the front lawn, weekend garage sales, and that legendary grilled-cheese challenge
              every year. We couldn&apos;t be happier here. I want my kids growing up in the same
              proper Canadian neighbourhood I did — so keeping our streets&apos; bins clean is my
              way of looking after the place we love.
            </p>
            <p className="mt-4 text-teal-400 font-bold text-sm">— Steve · Mimico, since 2021</p>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-28 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-teal-500/8 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-500/6 rounded-full blur-[80px]" />
          </div>
          <div className="relative">
            <h2 className="text-4xl sm:text-6xl font-black mb-4">Your bin is waiting.<br /><span className="text-slate-500">Sadly.</span></h2>
            <p className="text-slate-400 text-lg mb-3 max-w-xl mx-auto">
              Join your Mimico and New Toronto neighbours who never deal with a gross bin again.
            </p>
            <p className="text-slate-500 text-sm mb-3">
              <span className="live-dot w-1.5 h-1.5 rounded-full bg-orange-400 inline-block mr-1.5" />
              <span className="text-orange-400 font-bold">{spotsLeft} spots</span> left this week.
            </p>
            <p className="text-slate-600 text-sm mb-10">Thanks for supporting a local family. — Steve</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#book" className="glow-pulse-orange inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black px-8 py-4 rounded-xl text-lg transition-all">
                Book Online <ArrowRight size={18} />
              </a>
              <a href="sms:+15197293673&body=BIN CLEAN" className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors">
                <Phone size={18} /> Text 519-729-3673
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10 pb-28 md:pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center"><Trash2 size={13} className="text-white" /></div>
            <span className="font-black tracking-tight">Bin<span className="text-teal-400">Pilot</span></span>
            <span className="text-slate-600 text-sm ml-2">Mimico Bin Cleaning</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <a href="sms:+15197293673&body=BIN CLEAN" className="flex items-center gap-1.5 hover:text-slate-300 transition-colors"><Phone size={13} />519-729-3673</a>
            <a href="mailto:binpilotmimico@gmail.com" className="flex items-center gap-1.5 hover:text-slate-300 transition-colors"><Mail size={13} />binpilotmimico@gmail.com</a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} BinPilot — Mimico Bin Cleaning. Local neighbour. Serving Mimico &amp; New Toronto.
        </div>
      </footer>

      {/* ── Cute raccoon scarcity popup ── */}
      {showPopup && (
        <div className="fixed z-50 left-3 right-3 bottom-24 sm:left-6 sm:right-auto sm:bottom-6 sm:max-w-sm fade-in-up">
          <div className="relative bg-[#0a1422] border border-teal-500/30 rounded-2xl shadow-2xl shadow-teal-500/10 p-4 flex items-center gap-3">
            <button onClick={dismissPopup} aria-label="Close" className="absolute top-2 right-2 text-slate-500 hover:text-white transition-colors">
              <X size={16} />
            </button>
            <img src="/raccoons/peek.png" alt="A raccoon peeking out of a bin" className="w-16 h-16 rounded-xl object-cover bg-white/90 flex-shrink-0" />
            <div className="pr-4">
              <p className="text-sm font-black text-white leading-snug">
                Only <span className="text-orange-400">{spotsLeft} spots</span> left for Tuesday/Wednesday this week!
              </p>
              <a href="#book" onClick={dismissPopup} className="inline-flex items-center gap-1 mt-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors">
                Grab your spot <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky mobile CTA bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#04080f]/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex gap-3">
        <a href="sms:+15197293673&body=BIN CLEAN" className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 text-white font-bold text-sm py-3 rounded-xl">
          <Phone size={15} /> Text
        </a>
        <a href="#book" className="flex-[2] inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm py-3 rounded-xl glow-pulse-orange">
          Book My Clean →
        </a>
      </div>
    </div>
  );
}
