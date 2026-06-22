'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Dumbbell, User, Target } from 'lucide-react';

export default function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    whatsapp: '',
    goal: 'fat-loss',
    mode: 'online',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulated network latency for the pitch demo tomorrow
    // To wire up live Firebase data: drop your standard db addDoc structure here!
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <section id="application-form" className="relative w-full bg-zinc-950 py-24 px-4 flex flex-col items-center justify-center overflow-hidden border-t border-zinc-900">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-gymGold-500/30 to-transparent" />
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
            JOIN <span className="text-gymGold-500">TEAM DINESH</span>
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
            Limited slots available for this intake
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-8 px-6 relative">
          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-[2px] bg-zinc-800 z-0" />
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all duration-300 ${
                step >= num ? 'bg-gymGold-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Form Container Card */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-md min-h-[340px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <form onSubmit={step === 3 ? handleSubmit : handleNext} className="h-full flex flex-col justify-between flex-1">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {step === 1 && (
                    <>
                      <div className="flex items-center gap-2 text-gymGold-400 font-bold uppercase text-xs tracking-wider mb-2">
                        <User size={14} /> Profile Information
                      </div>
                      <div>
                        <label className="block text-zinc-400 font-bold text-[11px] uppercase tracking-wider mb-2">Your Name</label>
                        <input
                          required
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-gymGold-500 transition"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                          <label className="block text-zinc-400 font-bold text-[11px] uppercase tracking-wider mb-2">Age</label>
                          <input
                            required
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="22"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-gymGold-500 transition"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-zinc-400 font-bold text-[11px] uppercase tracking-wider mb-2">WhatsApp No.</label>
                          <input
                            required
                            type="tel"
                            name="whatsapp"
                            value={formData.whatsapp}
                            onChange={handleChange}
                            placeholder="+91 XXXXX XXXXX"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-gymGold-500 transition"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className="flex items-center gap-2 text-gymGold-400 font-bold uppercase text-xs tracking-wider mb-2">
                        <Target size={14} /> Fitness Target
                      </div>
                      <div>
                        <label className="block text-zinc-400 font-bold text-[11px] uppercase tracking-wider mb-3">Primary Goal</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['Fat Loss', 'Muscle Gain', 'Recomp', 'Athleticism'].map((goalOption) => {
                            const value = goalOption.toLowerCase().replace(' ', '-');
                            return (
                              <button
                                type="button"
                                key={value}
                                onClick={() => setFormData({ ...formData, goal: value })}
                                className={`p-4 rounded-xl border text-xs font-black uppercase tracking-wider transition ${
                                  formData.goal === value
                                    ? 'bg-gymGold-500/10 border-gymGold-500 text-gymGold-400 shadow-[0_0_15px_rgba(245,158,11,0.05)]'
                                    : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                }`}
                              >
                                {goalOption}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <div className="flex items-center gap-2 text-gymGold-400 font-bold uppercase text-xs tracking-wider mb-2">
                        <Dumbbell size={14} /> Training Ecosystem
                      </div>
                      <div>
                        <label className="block text-zinc-400 font-bold text-[11px] uppercase tracking-wider mb-3">Preferred Mode</label>
                        <div className="space-y-2">
                          {[
                            { id: 'online', title: 'Online Coaching', desc: 'Custom structural frameworks anywhere globally.' },
                            { id: 'offline', title: 'In-Person Academy', desc: 'Elite premium 1-on-1 private gym coaching.' },
                          ].map((modeOption) => (
                            <button
                              type="button"
                              key={modeOption.id}
                              onClick={() => setFormData({ ...formData, mode: modeOption.id })}
                              className={`w-full p-4 rounded-xl border text-left transition flex flex-col ${
                                formData.mode === modeOption.id
                                  ? 'bg-gymGold-500/10 border-gymGold-500'
                                  : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                              }`}
                            >
                              <span className={`text-xs font-black uppercase tracking-wider ${formData.mode === modeOption.id ? 'text-gymGold-400' : 'text-zinc-400'}`}>
                                {modeOption.title}
                              </span>
                              <span className="text-[11px] text-zinc-500 font-medium mt-0.5">{modeOption.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>

                {/* Footer Controls */}
                <div className="flex justify-between gap-3 mt-8 pt-4 border-t border-zinc-800/40">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-5 py-3 border border-zinc-800 text-zinc-400 rounded-xl font-bold text-xs uppercase tracking-wider hover:border-zinc-700 transition"
                    >
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 max-w-[140px] px-5 py-3 bg-gymGold-500 text-black rounded-xl font-black text-xs uppercase tracking-wider hover:bg-gymGold-600 transition disabled:opacity-50 text-center justify-center items-center flex"
                  >
                    {isSubmitting ? 'Processing...' : step === 3 ? 'Submit Application' : 'Continue'}
                  </button>
                </div>
              </form>
            ) : (
              /* Success Landing Framework View */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-8"
              >
                <CheckCircle2 size={56} className="text-gymGold-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] mb-4" />
                <h3 className="text-white font-black uppercase text-lg tracking-tight">Application Transmitted</h3>
                <p className="text-zinc-400 text-xs font-medium max-w-xs mt-2 leading-relaxed">
                  Boom, <span className="text-gymGold-400 font-bold">{formData.name}</span>! Your details are stored. Team Dinesh will reach out via WhatsApp soon.
                </p>
                <button
                  onClick={() => { setStep(1); setIsSuccess(false); }}
                  className="mt-6 text-zinc-500 hover:text-zinc-300 font-bold text-[11px] uppercase tracking-widest underline"
                >
                  Submit Another Form
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}