// app/template.jsx
"use client";
import { motion } from "framer-motion";

export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }} // Starts slightly lower and invisible
      animate={{ opacity: 1, y: 0 }}  // Fades in and slides to normal position
      transition={{ ease: "easeOut", duration: 0.4 }} // Controls the speed
    >
      {children}
    </motion.div>
  );
}