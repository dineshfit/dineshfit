'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Clock, Apple, Activity, Award } from 'lucide-react';

const coreFeatures = [
  {
    icon: <Apple className="text-gymGold-500 w-6 h-6" />,
    title: "Customized Nutrition",
    desc: "No crash diets. Tailored caloric structures built strictly around foods you like, matching your metabolic rate."
  },
  {
    icon: <Zap className="text-gymGold-500 w-6 h-6" />,
    title: "Hyper-Targeted Workouts",
    desc: "Gym or home setups. Progression tracking charts designed to break physical plateaus and optimize recovery."
  },
  {
    icon: <Clock className="text-gymGold-500 w-6 h-6" />,
    title: "24/7 Account Support",
    desc: "Direct access through a premium ecosystem. Real-time feedback adjustments whenever your schedule shifts."
  },
  {
    icon: <Activity className="text-gymGold-500 w-6 h-6" />,
    title: "Weekly Bio-Audits",
    desc: "Consistent check-ins to monitor strength milestones, sleep patterns, fat-loss curves, and energy tracking."
  },
  {
    icon: <ShieldCheck className="text-gymGold-500 w-6 h-6" />,
    title: "Science-Backed Frameworks",
    desc: "Zero generic guesswork. Fully optimized programs matching modern exercise biomechanics and physiology."
  },
  {
    icon: <Award className="text-gymGold-500 w-6 h-6" />,
    title: "Competition Breed Blueprint",
    desc: "Built by an active ICN stage athlete. Learn structural conditioning protocols used by championship frames."
  }
];

export default function Features() {
  return (
    <section className="bg-black py-20 px-4 w-full flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <div className="mb-14 text-left border-l-4 border-gymGold-500 pl-4">
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
            THE SYSTEM OF <span className="text-gymGold-500">TRANSFORMATION</span>
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mt-1">
            Why clients cross the finish line while others quit
          </p>
        </div>

        {/* High-End Tech Grid Layout matching your attached theme design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreFeatures.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-6 hover:border-gymGold-500/40 transition-all duration-300 group backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center border border-zinc-800 group-hover:border-gymGold-500/30 transition-all duration-300 mb-4 shadow-inner">
                {feat.icon}
              </div>
              <h3 className="text-white font-black uppercase text-sm tracking-wide group-hover:text-gymGold-400 transition-colors">
                {feat.title}
              </h3>
              <p className="text-zinc-500 text-xs font-medium mt-2 leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}