import { motion } from 'framer-motion';

const ScrollReveal = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1.0] // Smooth ease-out curve similar to Brevian
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
