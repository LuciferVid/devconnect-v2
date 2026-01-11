import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LiveTerminal = () => {
  const [lines, setLines] = useState([
    { text: 'Initializing DevConnect...', color: 'text-primary-400' },
    { text: 'Connecting to neural network...', color: 'text-gray-400' },
  ]);

  const commands = [
    'npm install core-talent',
    'git commit -m "Build the future"',
    'sh run-innovation.sh',
    'docker up -d collaboration',
    'status: all systems green',
    'ping localhost... 0.1ms',
    'found: 128 new open positions',
    'success: connection established',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomCmd = commands[Math.floor(Math.random() * commands.length)];
      setLines(prev => {
        const next = [...prev, { text: `> ${randomCmd}`, color: 'text-white/80' }];
        if (next.length > 8) return next.slice(1);
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden font-mono text-xs md:text-sm shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
        </div>
        <div className="text-[10px] text-gray-500 uppercase tracking-widest ml-2">Terminal / bash</div>
      </div>
      <div className="p-4 h-48 md:h-56 overflow-hidden flex flex-col justify-end">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${line.color} mb-1`}
          >
            {line.text}
          </motion.div>
        ))}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-primary-500"
        ></motion.span>
      </div>
    </div>
  );
};

export default LiveTerminal;
