"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { staggerChildren, fadeInUp } from "@/lib/motion";
import type { WorkGalleryImage } from "@/lib/types";

interface WorkGalleryProps {
  images: WorkGalleryImage[];
  workTitle: string;
}

export function WorkGallery({ images, workTitle }: WorkGalleryProps) {
  if (images.length === 0) return null;

  const sorted = [...images].sort((a, b) => a.position - b.position);

  return (
    <ScrollReveal className="mb-12">
      <h2 className="font-display text-xl font-semibold text-paper-50 mb-4">Gallery</h2>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-3"
        variants={staggerChildren(0.06)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {sorted.map((image, i) => (
          <motion.div
            key={image.mediaId ?? image.url ?? i}
            variants={fadeInUp}
            className="relative aspect-video rounded-xl overflow-hidden bg-ink-800 border border-white/5"
          >
            {image.url ? (
              <Image
                src={image.url}
                alt={image.alt || `${workTitle} concept art`}
                fill
                sizes="(max-width: 768px) 45vw, 30vw"
                className="object-cover"
              />
            ) : null}
          </motion.div>
        ))}
      </motion.div>
    </ScrollReveal>
  );
}
