"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AtmosphericBackgroundProps {
  variant?: "hero" | "subtle" | "default";
  className?: string;
}

// Simple Cloud Wireframe Component (simplified for standalone)
function CloudWireframe({ className, duration = 20, delay = 0, strokeWidth = 1 }: { className?: string; duration?: number; delay?: number; strokeWidth?: number }) {
  return (
    <motion.svg
      viewBox="0 0 100 60"
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.path
        d="M10,50 Q25,25 40,50 T70,50 T90,50"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: [0, 1, 1],
          opacity: [0, 0.5, 0],
          x: [0, 5, 0]
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          delay: delay
        }}
      />
      {/* Additional Abstract Cloud Shapes */}
      <motion.path
        d="M20,40 Q35,15 50,40 T80,40"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ 
          pathLength: [0, 1, 1],
          opacity: [0, 0.3, 0]
        }}
        transition={{
          duration: duration * 1.2,
          repeat: Infinity,
          ease: "linear",
          delay: delay + 2
        }}
      />
    </motion.svg>
  );
}

export function AtmosphericBackground({ variant = "hero", className }: AtmosphericBackgroundProps) {
  const strokeColor = "text-[#3DD6D0]"; // Maru Brand Cyan

  if (variant === "subtle") {
    return (
      <div className={cn("absolute inset-0 pointer-events-none overflow-hidden select-none z-0", className)}>
         <div className="absolute top-[10%] right-[-10%] opacity-20">
           <CloudWireframe className={cn("w-[600px] h-[400px]", strokeColor)} duration={45} />
         </div>
         <div className="absolute bottom-[20%] left-[-5%] opacity-20">
           <CloudWireframe className={cn("w-[700px] h-[500px]", strokeColor)} duration={55} delay={3} />
         </div>
      </div>
    );
  }

  // Hero / Default
  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden select-none z-0", className)}>
      <div className="absolute inset-0 z-0">
         <div className="absolute top-[-10%] left-[-10%] opacity-30">
            <CloudWireframe className={cn("w-[1000px] h-[600px] rotate-6", strokeColor)} duration={60} />
         </div>
         <div className="absolute top-[20%] right-[-10%] opacity-30">
            <CloudWireframe className={cn("w-[900px] h-[500px] -rotate-6", strokeColor)} duration={50} delay={5} />
         </div>
         <div className="absolute bottom-[-10%] left-[20%] opacity-30">
            <CloudWireframe className={cn("w-[1100px] h-[700px] rotate-3", strokeColor)} duration={65} delay={2} />
         </div>
      </div>
    </div>
  );
}
