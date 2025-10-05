import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
  size: number;
  drift: number;
  petalType: string;
  swingAmplitude: number;
}

const petalEmojis = ['🌸', '🌺', '🌼', '💮', '🏵️'];

const PhysicsSakura = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Create initial petals with enhanced physics properties
    const initialPetals: Petal[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random horizontal position
      delay: Math.random() * 5, // Stagger animations
      duration: 10 + Math.random() * 6, // Varying fall speeds (slower)
      rotation: Math.random() * 360,
      size: 0.6 + Math.random() * 0.7, // Varying sizes
      drift: (Math.random() - 0.5) * 150, // More horizontal drift
      petalType: petalEmojis[Math.floor(Math.random() * petalEmojis.length)],
      swingAmplitude: 20 + Math.random() * 40, // Swinging motion amplitude
    }));
    setPetals(initialPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            fontSize: `${petal.size}rem`,
            filter: "blur(0.3px) drop-shadow(0 2px 4px rgba(255,182,193,0.4))",
          }}
          initial={{
            y: -50,
            x: 0,
            rotate: petal.rotation,
            opacity: 0,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [
              0,
              petal.drift * 0.3,
              petal.drift,
              petal.drift * 0.5,
              -petal.drift * 0.3,
              petal.drift * 0.2,
              0
            ],
            rotate: [
              petal.rotation,
              petal.rotation + 120,
              petal.rotation + 240,
              petal.rotation + 360,
            ],
            rotateX: [0, 180, 360, 180, 0],
            rotateY: [0, 90, 180, 270, 360],
            opacity: [0, 0.8, 1, 1, 0.9, 0.7, 0],
            scale: [1, 1.1, 0.9, 1.05, 0.95, 1],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1],
          }}
        >
          {petal.petalType}
        </motion.div>
      ))}
    </div>
  );
};

export default PhysicsSakura;


