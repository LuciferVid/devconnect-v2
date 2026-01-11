const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`
        relative overflow-hidden
        bg-white/[0.03] 
        backdrop-blur-md
        border border-white/10 
        rounded-2xl p-6
        shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
        transition-all duration-500
        group
        hover:bg-white/[0.05]
        hover:border-primary-500/50 
        hover:shadow-[0_0_40px_rgba(14,165,233,0.15)]
        ${className}
      `}
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;
