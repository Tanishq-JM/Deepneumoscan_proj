import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';

export default function Signup() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { t } = useLanguage();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate('/home', { replace: true });
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    try {
      const res = await api.signup(username, email, password);
      if (!res.token || !res.user) throw new Error('Invalid response');
      login(res.user, res.token);
      navigate('/home', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/src/assets/bg-medical.jpg')" }}
    >
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
      <div className="relative bg-white shadow-xl p-10 rounded-2xl w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 text-white p-3 rounded-full">
            <UserPlus size={30} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">{t('auth.signupTitle') || 'Create Account'}</h1>
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>
        )}
        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="text-gray-700 font-medium">{t('auth.username') || 'Username'}</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="John Doe"
              className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="text-gray-700 font-medium">{t('auth.email') || 'Email'}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
            <div>
            <label className="text-gray-700 font-medium">{t('auth.password') || 'Password'}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 disabled:opacity-60 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? '...' : (t('auth.signupButton') || 'Sign Up')}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          {t('auth.haveAccount') || 'Already have an account?'}
          <Link to="/login" className="text-blue-600 font-medium ml-1">{t('auth.login') || 'Login'}</Link>
        </p>
      </div>
    </div>
  );
}
