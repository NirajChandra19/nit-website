'use client';

/**
 * GlobalFireworks — Ambient Diwali firework bursts rendered across all pages.
 *
 * Performance notes:
 * - Each burst is a self-contained state entry removed automatically after 1.2 s.
 * - Particles animate with `will-change: transform, opacity` for GPU compositing.
 * - The whole layer is `pointer-events-none` so it never blocks clicks.
 * - Random spawn interval is throttled to 1.5-3 s to stay lightweight.
 * - `fixed` positioning + `z-10` keeps it above the page background but below
 *   the Navbar (z-50) and any modals.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Particle {
  angle: number;   // radians
  color: string;
  distance: number; // how far it travels (px)
  size: number;
}

interface Burst {
  id: number;
  x: number; // vw  (10–90)
  y: number; // vh  (10–50)
  particles: Particle[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const PARTICLE_COUNT = 24;
const DURATION = 1.2; // seconds

const DIWALI_PALETTES: string[][] = [
  ['#FF8C00', '#FFA500', '#FFD700', '#FF4500'],
  ['#FF0000', '#FF6347', '#FF8C00', '#FFD700'],
  ['#FFD700', '#FFC200', '#FF8C00', '#FFEC8B'],
  ['#C0392B', '#E74C3C', '#FF8C00', '#FFD700'],
  ['#8E44AD', '#FF8C00', '#FFD700', '#FF0066'],
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function buildParticles(palette: string[]): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    angle: (i / PARTICLE_COUNT) * Math.PI * 2,
    color: palette[i % palette.length],
    distance: randomBetween(60, 130),
    size: randomBetween(3, 6),
  }));
}

// ---------------------------------------------------------------------------
// Single Particle
// ---------------------------------------------------------------------------
function FireParticle({ particle, burstDuration }: { particle: Particle; burstDuration: number }) {
  const dx = Math.cos(particle.angle) * particle.distance;
  // gravity: land slightly lower than the pure circle trajectory
  const dy = Math.sin(particle.angle) * particle.distance + particle.distance * 0.25;

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{
        x: dx,
        y: dy,
        opacity: 0,
        scale: 0,
      }}
      transition={{
        duration: burstDuration,
        ease: [0.25, 0.46, 0.45, 0.94], // custom ease-out curve
      }}
      style={{
        position: 'absolute',
        width: particle.size,
        height: particle.size,
        borderRadius: '50%',
        backgroundColor: particle.color,
        boxShadow: `0 0 8px 2px ${particle.color}`,
        willChange: 'transform, opacity',
        // Centre the particle on the burst origin
        top: -particle.size / 2,
        left: -particle.size / 2,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Single Burst
// ---------------------------------------------------------------------------
function Firework({ burst }: { burst: Burst }) {
  return (
    <div
      style={{
        position: 'fixed',
        left: `${burst.x}vw`,
        top: `${burst.y}vh`,
        // No width/height — it's a 0×0 origin point; particles fly outward
        pointerEvents: 'none',
      }}
    >
      {burst.particles.map((p, i) => (
        <FireParticle key={i} particle={p} burstDuration={DURATION} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------
export default function GlobalFireworks() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const counterRef = useRef(0);

  useEffect(() => {
    function spawnBurst() {
      const palette = DIWALI_PALETTES[Math.floor(Math.random() * DIWALI_PALETTES.length)];
      const id = counterRef.current++;

      setBursts(prev => [
        ...prev,
        {
          id,
          x: randomBetween(10, 90),
          y: randomBetween(10, 50),
          particles: buildParticles(palette),
        },
      ]);

      // Auto-remove burst after animation completes + tiny buffer
      setTimeout(() => {
        setBursts(prev => prev.filter(b => b.id !== id));
      }, (DURATION + 0.1) * 1000);
    }

    // Schedule the first burst shortly after mount
    let timeoutId: ReturnType<typeof setTimeout>;

    function scheduleNext() {
      const delay = randomBetween(1500, 3000);
      timeoutId = setTimeout(() => {
        spawnBurst();
        scheduleNext(); // chain the next burst
      }, delay);
    }

    scheduleNext();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-10 pointer-events-none overflow-hidden"
    >
      <AnimatePresence>
        {bursts.map(burst => (
          <Firework key={burst.id} burst={burst} />
        ))}
      </AnimatePresence>
    </div>
  );
}
