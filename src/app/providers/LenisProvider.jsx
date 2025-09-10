"use client";

import { useEffect, useState, createContext, useContext } from "react";
import Lenis from "lenis";

// Create a context to provide the Lenis instance
const LenisContext = createContext(null);

export const useLenis = () => useContext(LenisContext);

export default function LenisProvider({ children }) {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      lerp: 0.1,        // smoothness
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
    });

    setLenis(lenisInstance);

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
