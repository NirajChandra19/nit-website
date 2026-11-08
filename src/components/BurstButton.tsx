'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const SPARK_COLORS = [
  'bg-amber-400 shadow-[0_0_12px_#fbbf24]',
  'bg-orange-500 shadow-[0_0_12px_#f97316]',
  'bg-yellow-300 shadow-[0_0_12px_#fde047]',
  'bg-red-500 shadow-[0_0_12px_#ef4444]',
  'bg-purple-500 shadow-[0_0_12px_#a855f7]',
  'bg-emerald-400 shadow-[0_0_12px_#34d399]'
];

export default function BurstButton() {
  const [rockets, setRockets] = useState<{ id: number; x: number }[]>([]);
  const [isCooldown, setIsCooldown] = useState(false);

  const handleShoot = useCallback(() => {
    // LAG FIX 1: Prevent spamming by limiting active rockets & adding cooldown
    if (isCooldown || rockets.length > 10) return; 

    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 300); // 300ms cooldown

    // LAG FIX 2: Shoot 2-3 rockets max instead of 3-5
    const rocketCount = Math.floor(Math.random() * 2) + 2; 
    
    const newRockets = Array.from({ length: rocketCount }).map((_, i) => ({
      id: Date.now() + i,
      x: 15 + Math.random() * 70, // 15vw to 85vw
    }));
    
    setRockets((prev) => [...prev, ...newRockets]);
  }, [isCooldown, rockets.length]);

  // Cleanly remove rockets from DOM to free memory
  const removeRocket = useCallback((id: number) => {
    setRockets((prev) => prev.filter(r => r.id !== id));
  }, []);

  return (
    <>
      <button
        onClick={handleShoot}
        disabled={isCooldown}
        className={`fixed bottom-6 right-6 z-[200] group flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold py-3 px-6 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.6)] transition-all active:scale-95 ${isCooldown ? 'opacity-80 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(249,115,22,0.8)] hover:from-orange-500 hover:to-amber-400'}`}
      >
        <Sparkles className={`w-5 h-5 ${!isCooldown && 'group-hover:animate-spin'}`} />
        <span className="tracking-wide">Burst!</span>
        {!isCooldown && <div className="absolute inset-0 rounded-full ring-2 ring-white/30 group-hover:ring-white/60 animate-pulse pointer-events-none" />}
      </button>

      <div className="fixed inset-0 pointer-events-none z-[150] overflow-hidden">
        <AnimatePresence>
          {rockets.map((rocket) => (
            <SkyshootRocket 
              key={rocket.id} 
              x={rocket.x} 
              onComplete={() => removeRocket(rocket.id)} 
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

function SkyshootRocket({ x, onComplete }: { x: number; onComplete: () => void }) {
  const [phase, setPhase] = useState<'rising' | 'bursting'>('rising');
  const burstY = 15 + Math.random() * 20; 
  const primaryColor = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
  
  // LAG FIX 3: 20 sparks per explosion instead of 36
  const sparks = Array.from({ length: 20 }).map((_, i) => {
    const angle = (i * (360 / 20)) + (Math.random() * 10);
    const radius = 60 + Math.random() * 80; 
    return {
      id: i,
      destX: Math.cos((angle * Math.PI) / 180) * radius,
      destY: Math.sin((angle * Math.PI) / 180) * radius,
      color: Math.random() > 0.25 ? primaryColor : SPARK_COLORS[0],
      size: Math.random() * 4 + 4,
    };
  });

  return (
    <div className="absolute inset-0">
      {phase === 'rising' && (
        <motion.div
          initial={{ x: `${x}vw`, y: '100vh', scale: 1 }}
          animate={{ y: `${burstY}vh` }}
          transition={{ duration: 0.6 + Math.random() * 0.3, ease: "easeOut" }}
          onAnimationComplete={() => setPhase('bursting')}
          className="absolute w-1 h-8 bg-gradient-to-t from-transparent via-orange-400 to-yellow-100 rounded-full blur-[1px]"
          // LAG FIX 4: GPU Hardware Acceleration
          style={{ willChange: 'transform' }} 
        />
      )}

      {phase === 'bursting' && (
        <>
          {sparks.map((spark) => (
            <motion.div
              key={spark.id}
              initial={{ x: `${x}vw`, y: `${burstY}vh`, scale: 0, opacity: 1 }}
              animate={{
                x: `calc(${x}vw + ${spark.destX}px)`,
                y: `calc(${burstY}vh + ${spark.destY}px + 40px)`, 
                scale: [0, 1.5, 0],
                opacity: [1, 1, 0]
              }}
              transition={{ duration: 1.2 + Math.random() * 0.4, ease: "easeOut" }}
              onAnimationComplete={spark.id === 0 ? onComplete : undefined}
              className={`absolute rounded-full ${spark.color}`}
              // LAG FIX 4: GPU Hardware Acceleration
              style={{ 
                width: spark.size, 
                height: spark.size,
                willChange: 'transform, opacity' 
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}