"use client";

import { motion } from "framer-motion";
import { Send, BellRing } from "lucide-react";
import { homeContent } from "@/constants/home";

export function Newsletter() {
  return (
    <section id="newsletter" className="relative w-full bg-black py-24 md:py-32 overflow-hidden border-t border-white/5">
      {/* Decorative ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-white/2 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-100 h-100 bg-zinc-800/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/8 rounded-[32px] md:rounded-[48px] p-8 md:p-16 lg:p-20 overflow-hidden relative">
          
          {/* Subtle inner glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/2 rounded-full blur-[60px]" />
          
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                <BellRing className="w-3.5 h-3.5 text-white" />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                  Weekly Updates
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-8 whitespace-pre-line">
                {homeContent.newsletter.title}
              </h2>
              
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
                {homeContent.newsletter.subtitle}
              </p>
            </motion.div>

            {/* Subscription Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative max-w-xl mx-auto"
            >
              <form 
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col sm:flex-row gap-3 p-2 rounded-[20px] md:rounded-[24px] bg-black/50 border border-white/10 focus-within:border-white/30 transition-all duration-500"
              >
                <input
                  type="email"
                  placeholder={homeContent.newsletter.placeholder}
                  className="flex-1 bg-transparent px-6 py-4 text-white placeholder:text-zinc-600 outline-none text-base md:text-lg"
                  required
                />
                <button
                  type="submit"
                  className="group relative flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold px-8 py-4 rounded-[14px] md:rounded-[18px] transition-all duration-300 overflow-hidden active:scale-[0.98]"
                >
                  <span className="relative z-10">{homeContent.newsletter.buttonText}</span>
                  <Send className="w-4 h-4 relative z-10 text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-shine" />
                </button>
              </form>
              
              <p className="mt-6 text-zinc-500 text-[11px] md:text-xs tracking-wide">
                {homeContent.newsletter.disclaimer}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
