const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`
        bg-dark-card 
        border border-white/10 
        rounded-xl p-6
        shadow-lg shadow-black/50
        backdrop-blur-sm
        transition-all duration-300
        hover:border-primary-500/30 hover:shadow-[0_0_30px_rgba(14,165,233,0.1)]
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
