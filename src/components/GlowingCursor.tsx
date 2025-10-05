import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const GlowingCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const hideCursor = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseleave", hideCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseleave", hideCursor);
    };
  }, [cursorX, cursorY]);

  // Don't show on touch devices
  if ('ontouchstart' in window) {
    return null;
  }

  return (
    <>
      {isVisible && (
        <>
          {/* Outer glow */}
          <motion.div
            className="fixed pointer-events-none z-50 mix-blend-screen"
            style={{
              left: cursorXSpring,
              top: cursorYSpring,
              x: "-50%",
              y: "-50%",
            }}
          >
            <div className="w-8 h-8 rounded-full bg-accent/20 blur-md" />
          </motion.div>
          
          {/* Inner dot */}
          <motion.div
            className="fixed pointer-events-none z-50"
            style={{
              left: cursorXSpring,
              top: cursorYSpring,
              x: "-50%",
              y: "-50%",
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          </motion.div>
        </>
      )}
    </>
  );
};

export default GlowingCursor;

