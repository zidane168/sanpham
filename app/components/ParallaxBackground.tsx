'use client';

import { motion, useScroll } from 'framer-motion';

export default function ParallaxBackground() {
  const { scrollY } = useScroll();

  return (
    <motion.div
      className="fixed inset-0 -z-10 bg-[url('/images/background-full.webp')] bg-cover bg-center"
      style={{
        y: scrollY * 0.5
      }}
    />
  );
}