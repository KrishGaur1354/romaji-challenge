import { motion } from "framer-motion";

const GradientOrbs = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Animated gradient orbs with smooth movement */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(255,135,178,0.4) 0%, rgba(255,107,158,0.2) 50%, transparent 100%)",
        }}
        animate={{
          x: [0, 100, 0, -100, 0],
          y: [0, -100, 0, 100, 0],
          scale: [1, 1.2, 1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ top: "10%", left: "20%" }}
      />
      
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-25 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(147,51,234,0.2) 50%, transparent 100%)",
        }}
        animate={{
          x: [0, -120, 0, 120, 0],
          y: [0, 120, 0, -120, 0],
          scale: [1, 1.1, 1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ bottom: "10%", right: "15%" }}
      />
      
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(79,70,229,0.2) 50%, transparent 100%)",
        }}
        animate={{
          x: [0, 80, 0, -80, 0],
          y: [0, -80, 0, 80, 0],
          scale: [1, 1.15, 1, 1.05, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      />

      {/* Subtle light rays effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(45deg, transparent 30%, rgba(255,135,178,0.05) 50%, transparent 70%)",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default GradientOrbs;

