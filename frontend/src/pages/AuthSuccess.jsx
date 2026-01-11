import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userData = searchParams.get('user');

    if (token && userData) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', userData);
      navigate('/dashboard');
    } else {
      navigate('/login?error=auth_failed');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-primary-500" size={48} />
        <p className="text-xl font-medium animate-pulse">Authenticating with GitHub...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
