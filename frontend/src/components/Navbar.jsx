import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User as UserIcon, LogOut } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
      }
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Explore', path: '/explore' },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-50 bg-dark-bg/80 backdrop-blur-2xl border-b border-white/5"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">

          {/* Left: Logo */}
          <div className="flex-shrink-0 w-64">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(14,165,233,0.5)] group-hover:shadow-[0_0_25px_rgba(14,165,233,0.8)] transition-all duration-300">
                D
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                DevConnect
              </span>
            </Link>
          </div>

          {/* Center: Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-baseline space-x-2 bg-white/5 rounded-full px-2 py-1 border border-white/5 backdrop-blur-md">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`
                    px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                    ${location.pathname === link.path
                      ? 'text-white bg-white/10 shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Auth Buttons */}
          <div className="hidden md:flex items-center justify-end w-64 gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to={`/profile/${user.username}`} className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 overflow-hidden group-hover:border-primary-500/50 transition-colors">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={18} />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="!text-sm !px-4 hover:bg-white/5">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" className="!text-sm !px-5 shadow-lg shadow-primary-500/20">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex flex-1 justify-end">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          className="md:hidden bg-dark-bg/95 backdrop-blur-xl border-b border-white/5"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <div className="px-4 pt-4 pb-6 space-y-2">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-400 hover:text-white hover:bg-white/5 block px-4 py-3 rounded-xl text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-6 flex flex-col gap-3 px-1">
              {user ? (
                <>
                  <Link to={`/profile/${user.username}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-white font-medium">{user.name}</span>
                  </Link>
                  <Button variant="ghost" className="w-full justify-center text-red-400 hover:bg-red-400/10" onClick={() => { handleLogout(); setIsOpen(false); }}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-center border border-white/10">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" className="w-full justify-center py-3">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
