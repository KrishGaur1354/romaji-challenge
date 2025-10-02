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
}

const PhysicsSakura = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Create initial petals with physics properties
    const initialPetals: Petal[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random horizontal position
      delay: Math.random() * 5, // Stagger animations
      duration: 8 + Math.random() * 4, // Varying fall speeds
      rotation: Math.random() * 360,
      size: 0.8 + Math.random() * 0.5, // Varying sizes
      drift: (Math.random() - 0.5) * 100, // Horizontal drift
    }));
    setPetals(initialPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute text-pink-300 dark:text-pink-400"
          style={{
            left: `${petal.x}%`,
            fontSize: `${petal.size}rem`,
            filter: "blur(0.5px)",
          }}
          initial={{
            y: -50,
            x: 0,
            rotate: petal.rotation,
            opacity: 0,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, petal.drift, -petal.drift / 2, petal.drift / 3, 0],
            rotate: [petal.rotation, petal.rotation + 360],
            opacity: [0, 1, 1, 0.8, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.1, 0.7, 0.9, 1],
          }}
        >
          🌸
        </motion.div>
      ))}
    </div>
  );
};

export default PhysicsSakura;


