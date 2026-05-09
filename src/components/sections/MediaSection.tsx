"use client";

import { motion } from "framer-motion";
import { MediaCard } from "@/components/ui/MediaCard";
import { MovieCard } from "@/types/types";

interface MediaSectionProps {
  title: string;
  items: MovieCard[];
  layout?: "grid" | "carousel";
}

export function MediaSection({ title, items, layout = "grid" }: MediaSectionProps) {
  if (!items || items.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as any }
    }
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-12 md:py-16">
      <div className="flex flex-col gap-8">
        <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight">
          {title}
        </h3>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={
            layout === "grid" 
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8"
              : "flex overflow-x-auto gap-6 pb-6 custom-scrollbar snap-x snap-mandatory px-1 scroll-smooth"
          }
        >
          {items.map((item, idx) => (
            <motion.div key={`${item.id}-${idx}`} variants={itemVariants}>
              <MediaCard 
                data={item} 
                variant="catalog" 
                container={layout === "grid" ? "grid" : "slider"}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
