"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { staggerChildren, fadeInUp } from "@/lib/motion";

interface WorkGalleryProps {
  images: string[];
  workTitle: string;
}

export function WorkGallery({ images, workTitle }: WorkGalleryProps) {
  if (images.length === 0) return null;

  return (
    <ScrollReveal className="px-margin-mobile md:px-margin-desktop py-lg">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Gallery</h2>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-sm"
        variants={staggerChildren(0.06)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {images.map((src, i) => (
          <motion.div
            key={src}
            variants={fadeInUp}
            className="relative aspect-video rounded-lg overflow-hidden border border-outline-variant/30 bg-surface-container-low"
          >
            <Image
              src={src}
              alt={`${workTitle} concept art ${i + 1}`}
              fill
              sizes="(max-width: 768px) 45vw, 30vw"
              className="object-cover"
            />
          </motion.div>
        ))}
      </motion.div>
    </ScrollReveal>
  );
}
