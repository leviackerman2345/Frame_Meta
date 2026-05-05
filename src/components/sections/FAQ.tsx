"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { homeContent } from "@/constants/home";
import { FAQItem } from "@/types/types";

/* ------------------------------------------------------------------ */
/*  FAQ Accordion Item Component                                       */
/* ------------------------------------------------------------------ */

function AccordionItem({
  item,
  isOpen,
  toggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  toggle: () => void;
}) {
  return (
    <div
      className={`group relative overflow-hidden transition-all duration-500 rounded-[24px] md:rounded-[32px] mb-4 ${
        isOpen ? "bg-white/5" : "bg-white/3 hover:bg-white/5"
      }`}
    >
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between gap-6 p-6 md:p-8 text-left outline-none"
      >
        <span
          className={`text-lg md:text-xl font-bold transition-colors duration-500 ${
            isOpen ? "text-white" : "text-zinc-300 group-hover:text-white"
          }`}
        >
          {item.question}
        </span>

        {/* Toggle Icon Container */}
        <motion.div
          animate={{ 
            backgroundColor: isOpen ? "#e2ff00" : "#000000",
            borderColor: isOpen ? "#e2ff00" : "rgba(255,255,255,0.1)"
          }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="relative shrink-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border"
        >
          <AnimatePresence>
            <motion.div
              key={isOpen ? "open" : "closed"}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ 
                opacity: 0,
                rotate: 45, 
                scale: 0.9 
              }}
              transition={{ 
                duration: 0.3, 
                ease: "easeInOut" 
              }}
              className="absolute flex items-center justify-center"
            >
              {isOpen ? (
                <Minus className="w-5 h-5 md:w-6 md:h-6 text-black" />
              ) : (
                <Plus className="w-5 h-5 md:w-6 md:h-6 text-white" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-6 pb-6 md:px-8 md:pb-8">
              {/* Nested Answer Card */}
              <div className="p-6 md:p-8 rounded-[16px] md:rounded-[20px] border border-white/10 bg-white/2">
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main FAQ Section Component                                         */
/* ------------------------------------------------------------------ */

export function FAQ() {
  const { heading, items } = homeContent.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative w-full bg-black pt-24 pb-40 overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-150 bg-brand-accent/3 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-125 h-125 bg-[#e2ff00]/2 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Centered Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-8">
              {heading.title}
            </h2>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              {heading.description}
            </p>
          </motion.div>
        </div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {items.map((item, index) => (
            <AccordionItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              toggle={() => toggleItem(index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
