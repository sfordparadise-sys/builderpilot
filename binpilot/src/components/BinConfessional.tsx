'use client';

import { useState } from 'react';
import { ArrowRight, Phone, RotateCcw, Sparkles } from 'lucide-react';

type Option = { e: string; t: string; s: number; r: string };
type Question = { q: string; sub: string; options: Option[] };

const QUESTIONS: Question[] = [
  {
    q: 'When did you last clean your garbage bin?',
    sub: 'Be honest. Nobody’s watching.',
    options: [
      { e: '😇', t: 'Last month — I’m on top of it', s: 0, r: 'Look at you. Gold star.' },
      { e: '😅', t: 'Sometime this year… I think', s: 1, r: '“I think” is doing a lot of work there.' },
      { e: '🤢', t: 'Honestly? Never', s: 3, r: 'A bold confession. Respect.' },
      { e: '💀', t: 'You can clean a bin?', s: 3, r: 'Oh, Steve has news for you.' },
    ],
  },
  {
    q: 'How does your bin smell on a hot summer day?',
    sub: 'You know the one. That smell.',
    options: [
      { e: '🌸', t: 'Perfectly fine, thanks', s: 0, r: 'Sure it does.' },
      { e: '😅', t: 'A little funky, nothing major', s: 1, r: '“A little funky” is how it starts.' },
      { e: '🤮', t: 'I hold my breath when I open it', s: 2, r: 'That’s not a smell, that’s a warning.' },
      { e: '💀', t: 'My neighbours have complained', s: 3, r: 'Yikes — let’s fix that fast.' },
    ],
  },
  {
    q: 'Ever seen anything moving in your green bin?',
    sub: 'Think carefully before answering.',
    options: [
      { e: '😇', t: 'Nope, never', s: 0, r: 'Lucky you.' },
      { e: '🪰', t: 'Maybe a fly or two', s: 1, r: 'Where there’s two…' },
      { e: '😱', t: 'I’ve seen some… wriggling', s: 3, r: 'We’re so sorry. Also: ew.' },
    ],
  },
  {
    q: 'Have raccoons or skunks ever visited your bins?',
    sub: 'A smelly bin is a dinner bell for wildlife.',
    options: [
      { e: '🔒', t: 'Never — my bins are sealed tight', s: 0, r: 'Fortress mode. Respect.' },
      { e: '🦝', t: 'Once or twice, no big deal', s: 1, r: 'They always come back.' },
      { e: '🦨', t: 'They visit weekly. I’ve named them.', s: 2, r: 'Naming them is how they win.' },
      { e: '🐾', t: 'My bins are a wildlife café', s: 3, r: 'Table for four, party of raccoons.' },
    ],
  },
  {
    q: 'Would you ever clean them yourself?',
    sub: 'Last one. Total honesty.',
    options: [
      { e: '💪', t: 'Sure, I don’t mind', s: 1, r: 'Brave. But why would you?' },
      { e: '😐', t: 'Eh… probably not', s: 2, r: 'Didn’t think so.' },
      { e: '🙅', t: 'Absolutely not', s: 3, r: 'That’s what Steve is for.' },
      { e: '📱', t: 'That’s literally why I’m here', s: 3, r: 'Now we’re talking.' },
    ],
  },
];

const RESULTS = [
  { min: 13, title: 'Full Wildlife Sanctuary', emoji: '🦝', body: 'We’re amazed you’re still standing this close to it. This is a job for 200°F hot water — and Steve’s already got Wednesday open.' },
  { min: 9,  title: 'Certified Raccoon Magnet', emoji: '🦨', body: 'Your bin is officially on the local wildlife’s speed dial. One hot-water treatment and the dinner bell goes silent.' },
  { min: 5,  title: 'Mild Biohazard', emoji: '🪰', body: 'It’s creeping up on you — the smell, the flies, the “what is that.” Catch it now with a quick 200°F reset.' },
  { min: 0,  title: 'Surprisingly Respectable', emoji: '✨', body: 'Your bins are… actually okay? Rare. A monthly clean keeps them that way — and your neighbours mildly jealous.' },
];

export default function BinConfessional() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [reaction, setReaction] = useState('');
  const [done, setDone] = useState(false);

  function choose(qi: number, oi: number) {
    if (picked !== null) return;
    const opt = QUESTIONS[qi].options[oi];
    setPicked(oi);
    setReaction(opt.r);
    setTimeout(() => {
      setScore((s) => s + opt.s);
      setPicked(null);
      setReaction('');
      if (qi + 1 >= QUESTIONS.length) setDone(true);
      else setStep(qi + 1);
    }, 900);
  }

  function restart() {
    setStep(0); setScore(0); setPicked(null); setReaction(''); setDone(false);
  }

  const result = RESULTS.find((r) => score >= r.min) || RESULTS[RESULTS.length - 1];
  const progress = done ? 100 : Math.round((step / QUESTIONS.length) * 100);

  return (
    <section id="confessional" className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide">
            <Sparkles size={12} /> THE BIN CONFESSIONAL
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-2">What’s really living in your bin?</h2>
          <p className="text-slate-600 text-sm">5 questions · 60 seconds · no email required</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 min-h-[360px] flex flex-col">
          {/* progress */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-slate-500 mb-2 font-semibold">
              <span>{done ? 'Verdict' : `Question ${step + 1} of ${QUESTIONS.length}`}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-500 to-orange-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {!done ? (
            <div className="flex-1 flex flex-col">
              <h3 className="text-xl sm:text-2xl font-black mb-1.5">{QUESTIONS[step].q}</h3>
              <p className="text-slate-500 text-sm italic mb-5">{QUESTIONS[step].sub}</p>
              <div className="space-y-3">
                {QUESTIONS[step].options.map((o, oi) => (
                  <button
                    key={oi}
                    onClick={() => choose(step, oi)}
                    className={`w-full flex items-center gap-3 text-left px-4 py-3.5 rounded-xl border transition-all ${
                      picked === oi
                        ? 'bg-teal-500/20 border-teal-500/50'
                        : 'bg-slate-100 border-slate-200 hover:border-teal-500/30 hover:bg-slate-100'
                    } ${picked !== null && picked !== oi ? 'opacity-40' : ''}`}
                  >
                    <span className="text-2xl flex-shrink-0">{o.e}</span>
                    <span className="font-semibold text-sm text-slate-800">{o.t}</span>
                  </button>
                ))}
              </div>
              <div className="h-6 mt-4 text-center">
                {reaction && <p className="text-sm font-bold text-teal-600 fade-in-up">{reaction}</p>}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center fade-in-up">
              <span className="text-5xl mb-3">{result.emoji}</span>
              <p className="text-xs font-black text-orange-600 tracking-widest mb-1">YOUR VERDICT</p>
              <h3 className="text-2xl sm:text-3xl font-black mb-3">{result.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-md mb-7">{result.body}</p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a href="#book" className="glow-pulse-orange inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black px-7 py-3.5 rounded-xl transition-all">
                  Book My Clean — from $25 <ArrowRight size={16} />
                </a>
                <a href="sms:+15197293673&body=BIN CLEAN" className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-900 font-bold px-7 py-3.5 rounded-xl transition-colors">
                  <Phone size={16} /> Text Steve
                </a>
              </div>
              <button onClick={restart} className="mt-5 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors">
                <RotateCcw size={12} /> Retake the confessional
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
