'use client';

import { useState } from 'react';
import {
  Trash2,
  CheckCircle,
  Star,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  Building2,
  Home,
  Droplets,
  Shield,
  Clock,
  Leaf,
  Menu,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function BinPilotPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Service Area', href: '#area' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  const services = [
    {
      icon: Home,
      title: 'Residential Homes',
      desc: 'Full sanitization of your green, blue, and grey bins. We show up after collection day, clean on-site, and leave them fresh.',
      features: ['All three bin types', 'High-pressure hot wash', 'Deodorizing treatment', 'On-site service — no drop-off'],
    },
    {
      icon: Building2,
      title: 'Multi-Unit Buildings',
      desc: 'Scheduled cleaning for condo and apartment bin rooms, compactor areas, and shared containers. One invoice, zero hassle.',
      features: ['Bin room & compactor areas', 'Flexible scheduling', 'Single monthly invoice', 'Property manager portal'],
    },
  ];

  const steps = [
    { num: '01', title: 'Book Your Service', desc: 'Choose your address and service type. We confirm within 24 hours.' },
    { num: '02', title: 'We Show Up After Collection', desc: 'Our team arrives after your bins have been emptied and cleans them on your property — no hauling required.' },
    { num: '03', title: 'Sparkling & Odour-Free', desc: 'Bins are returned sanitized, deodorized, and smelling clean. You never have to think about it again.' },
  ];

  const whyUs = [
    { icon: Droplets, title: 'Hot-Water Pressure Wash', desc: 'We use 200°F pressurized water to kill bacteria, mould, and odours — no harsh chemicals left behind.' },
    { icon: Clock, title: 'After Collection Day', desc: "We sync with your pickup schedule so bins are empty when we arrive. You don't lift a finger." },
    { icon: Leaf, title: 'Eco-Friendly Rinse', desc: 'All wastewater is captured and disposed of properly — nothing goes into storm drains.' },
    { icon: Shield, title: 'Fully Insured', desc: 'We carry full liability coverage for residential and multi-unit properties throughout Mimico and New Toronto.' },
  ];

  const plans = [
    {
      name: 'One-Time',
      price: '$35',
      per: 'per visit',
      desc: 'Perfect for a one-off deep clean before summer or a move.',
      features: ['Up to 3 bins', 'Hot-pressure wash', 'Deodorizer treatment'],
      cta: 'Book a Clean',
      highlight: false,
    },
    {
      name: 'Monthly',
      price: '$25',
      per: 'per visit',
      desc: 'Our most popular plan — bins cleaned every 4 weeks, year-round.',
      features: ['Up to 3 bins', 'Hot-pressure wash', 'Deodorizer treatment', 'Priority scheduling', 'Email reminders'],
      cta: 'Start Monthly',
      highlight: true,
    },
    {
      name: 'Multi-Unit',
      price: 'Custom',
      per: 'monthly',
      desc: 'Tailored pricing for condos, apartments, and townhouse complexes.',
      features: ['Bin rooms & compactors', 'Flexible schedule', 'Property manager dashboard', 'Single invoice'],
      cta: 'Get a Quote',
      highlight: false,
    },
  ];

  const faqs = [
    {
      q: 'Where exactly do you service?',
      a: 'We service all of Mimico and New Toronto — including the areas roughly bounded by the Gardiner Expressway to the north, Lake Ontario to the south, Kipling Ave to the west, and Roncesvalles/Jameson to the east.',
    },
    {
      q: 'Do I need to be home?',
      a: 'No. As long as your bins are at the curb or in your usual spot after collection, we can do the job and leave them back in place. We will send you a photo when done.',
    },
    {
      q: 'What happens in winter?',
      a: 'We operate year-round. Cold weather is actually when bin cleaning matters most — frozen organic matter can cause lasting odour. Our hot-water system works in all weather.',
    },
    {
      q: 'Which bins do you clean?',
      a: 'We clean all City of Toronto bins: green organics, blue recycling, and grey garbage. We also clean privately-owned bins for multi-unit buildings.',
    },
    {
      q: 'How do you handle the wastewater?',
      a: 'All wastewater is captured in our onboard tank and disposed of at a licensed facility. Nothing enters storm drains or your property.',
    },
    {
      q: 'Can I pause or cancel my subscription?',
      a: 'Yes. Cancel or pause anytime with 7 days notice before your next scheduled service. No cancellation fees, no questions asked.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white">
      {/* ── Nav ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
              <Trash2 size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Bin<span className="text-green-400">Pilot</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <a
            href="#pricing"
            className="hidden md:inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Book Now
          </a>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
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
              href="#pricing"
              className="block mt-2 bg-green-500 text-black font-semibold text-sm px-4 py-2 rounded-lg text-center"
              onClick={() => setMobileOpen(false)}
            >
              Book Now
            </a>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <MapPin size={12} />
            Serving Mimico &amp; New Toronto
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Clean bins.<br />
            <span className="text-green-400">Zero effort.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Professional hot-water bin cleaning for homes and multi-unit buildings in Mimico and New Toronto.
            We show up after collection day — you never touch a dirty bin again.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-7 py-3.5 rounded-xl text-base transition-colors"
            >
              Get Started <ArrowRight size={16} />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-colors"
            >
              See How It Works
            </a>
          </div>

          {/* Social proof strip */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span>5.0 on Google</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-green-400" />
              <span>Fully insured</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Leaf size={14} className="text-green-400" />
              <span>Eco-friendly wastewater disposal</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">What we clean</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            We service every kind of property in Mimico and New Toronto — from detached homes to large multi-unit buildings.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-8 hover:border-green-500/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-5 group-hover:bg-green-500/15 transition-colors">
                <s.icon size={22} className="text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">{s.desc}</p>
              <ul className="space-y-2">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">How it works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Three steps, zero hassle. We handle everything from scheduling to clean-up.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] right-[-40%] h-px bg-gradient-to-r from-green-500/30 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
                  <span className="text-green-400 font-bold text-lg">{s.num}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Why BinPilot</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            We built a better bin cleaning service from the ground up — for Mimico and New Toronto specifically.
          </p>
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
      </section>

      {/* ── Service Area ── */}
      <section id="area" className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
                <MapPin size={12} />
                Our Service Zone
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-5">
                Mimico &amp;<br />New Toronto
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                We are hyper-local by design. By focusing exclusively on Mimico and New Toronto, we can offer consistent scheduling, faster response times, and pricing that actually makes sense.
              </p>
              <p className="text-slate-400 leading-relaxed mb-8">
                Whether you are a homeowner on Lakeshore or a property manager running a mid-rise on Lake Shore Boulevard West, we have a plan for you.
              </p>
              <ul className="space-y-2.5">
                {[
                  'Mimico (all streets)',
                  'New Toronto',
                  'Long Branch border areas',
                  'Stonegate-Queensway adjacent streets',
                ].map((area) => (
                  <li key={area} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual map placeholder */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-white/[0.03] border border-white/8 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-full border border-green-500/20 flex items-center justify-center">
                      <div className="w-28 h-28 rounded-full border border-green-500/30 flex items-center justify-center bg-green-500/5">
                        <div className="text-center">
                          <MapPin size={28} className="text-green-400 mx-auto mb-1" />
                          <span className="text-xs font-semibold text-green-400">Mimico &amp;</span>
                          <br />
                          <span className="text-xs font-semibold text-green-400">New Toronto</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-green-400 shadow-[0_0_12px_4px_rgba(74,222,128,0.4)]" />
                    <div className="absolute bottom-4 -left-6 w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_10px_3px_rgba(74,222,128,0.35)]" />
                    <div className="absolute top-8 -left-10 w-2 h-2 rounded-full bg-green-400/60" />
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-slate-600 mt-3">
                Not sure if you're in our zone? Text us — we'll confirm in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Simple pricing</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            No hidden fees. No lock-in contracts. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl p-7 flex flex-col ${
                p.highlight
                  ? 'bg-green-500/10 border-2 border-green-500/40'
                  : 'bg-white/[0.03] border border-white/8'
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                  <Sparkles size={11} />
                  Most Popular
                </div>
              )}
              <div className="mb-5">
                <p className="text-slate-400 text-sm font-medium mb-1">{p.name}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold">{p.price}</span>
                  {p.price !== 'Custom' && (
                    <span className="text-slate-500 text-sm">{p.per}</span>
                  )}
                </div>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">{p.desc}</p>
              </div>

              <ul className="space-y-2.5 mb-7 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="mailto:hello@binpilot.ca"
                className={`text-center font-semibold text-sm px-5 py-3 rounded-xl transition-colors ${
                  p.highlight
                    ? 'bg-green-500 hover:bg-green-400 text-black'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                }`}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 bg-white/[0.02] border-y border-white/5">
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
                    className={`text-slate-400 flex-shrink-0 transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
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

      {/* ── CTA ── */}
      <section className="py-28 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-green-500/8 rounded-full blur-[80px]" />
          </div>
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-5">
              Ready for clean bins?
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Join Mimico and New Toronto neighbours who never deal with dirty, smelly bins again.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:hello@binpilot.ca"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-xl text-base transition-colors"
              >
                <Mail size={16} />
                Email Us to Book
              </a>
              <a
                href="tel:+14165550123"
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors"
              >
                <Phone size={16} />
                Call or Text
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

            <div className="flex items-center gap-6 text-sm text-slate-500">
              {navLinks.map((l) => (
                <a key={l.label} href={l.href} className="hover:text-slate-300 transition-colors">
                  {l.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500">
              <a href="mailto:hello@binpilot.ca" className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                <Mail size={13} />
                hello@binpilot.ca
              </a>
              <a href="tel:+14165550123" className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                <Phone size={13} />
                (416) 555-0123
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} BinPilot — Mimico Bin Cleaning. Serving Mimico &amp; New Toronto.
          </div>
        </div>
      </footer>
    </div>
  );
}
