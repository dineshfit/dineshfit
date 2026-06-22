'use client';

import { motion } from 'framer-motion';
import { Dumbbell, Globe, Check } from 'lucide-react';

const tiers = [
  {
    title: "Online Premium Elite Coaching",
    icon: <Globe className="text-gymGold-500 w-5 h-5" />,
    scope: "Global Training System",
    description: "Full digital transformation workspace built completely around your lifestyle, timeline, and targets.",
    points: [
      "Bespoke macro nutrition frameworks",
      "Dynamic gym/home workout program",
      "Weekly video check-in audits & corrections",
      "Direct WhatsApp communication access",
      "Supplement strategy optimization guides"
    ],
    cta: "Secure Online Slot"
  },
  {
    title: "In-Person Performance Academy",
    icon: <Dumbbell className="text-gymGold-500 w-5 h-5" />,
    scope: "Private Local Coaching",
    description: "Premium elite 1-on-1 performance and form tuning inside high-end training facilities.",
    points: [
      "Everything included in the Online Elite tier",
      "Live biometric form & structural adjustments",
      "High-intensity session pacing guidance",
      "Direct posture & mechanics tracking",
      "Strict real-time accountability loops"
    ],
    cta: "Apply For Academy Slot"
  }
];

export default function Programs() {
  return (
    <section className="bg-black py-16 px-4 w-full flex flex-col items-center border-t border-zinc-900">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
            CHOOSE YOUR <span className="text-gymGold-500">ECOSYSTEM</span>
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
            Engineered setups for massive alignment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tiers.map((tier, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-gymGold-500/20 transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase bg-zinc-950 border border-zinc-800 text-zinc-400 px-3 py-1 rounded-full tracking-wider">
                    {tier.scope}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                    {tier.icon}
                  </div>
                </div>

                <h3 className="text-white font-black uppercase text-lg tracking-tight leading-snug group-hover:text-gymGold-400 transition-colors">
                  {tier.title}
                </h3>
                
                <p className="text-zinc-500 text-xs font-medium mt-3 leading-relaxed">
                  {tier.description}
                </p>

                <div className="h-[1px] bg-gradient-to-r from-zinc-800 to-transparent my-6" />

                <ul className="space-y-3">
                  {tier.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5 text-zinc-400 text-xs font-medium">
                      <Check size={14} className="text-gymGold-500 mt-0.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full mt-8 py-3.5 border border-zinc-800 hover:border-gymGold-500 rounded-xl bg-zinc-950/50 text-white hover:text-black hover:bg-gymGold-500 text-xs font-black uppercase tracking-wider transition-all duration-300"
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}