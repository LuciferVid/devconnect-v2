import { motion } from 'framer-motion';

const Input = ({ type = 'text', placeholder, value, onChange, icon, name, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}
      <motion.input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full bg-white dark:bg-slate-900 
          border border-gray-300 dark:border-slate-700 
          rounded-lg px-4 py-2.5
          text-gray-900 dark:text-white 
          placeholder-gray-500 dark:placeholder-gray-400 
          outline-none
          focus:border-primary-500 focus:ring-1 focus:ring-primary-500
          transition-all duration-200
          ${icon ? 'pl-10' : ''}
        `}
        whileFocus={{ scale: 1.0 }}
      />
    </div>
  );
};

export default Input;
