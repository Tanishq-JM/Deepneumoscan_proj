import React, { useState, useEffect } from "react";
import { LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

export default function Login(): JSX.Element {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Missing email or password");
      return;
    }
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (!res.token || !res.user) {
        throw new Error("Invalid response from server");
      }
      login(res.user, res.token);
      if (remember) {
        localStorage.setItem("remember_login", "true");
      } else {
        localStorage.removeItem("remember_login");
      }
      navigate("/home", { replace: true });
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/src/assets/bg-medical.jpg')" }}
    >
      {/* translucent overlay with blur */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>

      <div className="relative bg-white shadow-xl p-10 rounded-2xl w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 text-white p-3 rounded-full">
            <LogIn size={28} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-6">{t('auth.loginTitle') || 'Sign In'}</h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={onSubmit}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="text-gray-700 font-medium">
              {t('auth.email') || 'Email'}
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="text-gray-700 font-medium">
              {t('auth.password') || 'Password'}
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">{t('auth.remember') || 'Remember me'}</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot?
            </Link>
          </div>

          {/* Sign In button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? '...' : (t('auth.loginButton') || 'Sign In')}
          </button>
        </form>

        {/* Sign up link */}
        <p className="text-center mt-4 text-gray-600">
          {t('auth.noAccount') || "Don't have an account?"}
          <Link to="/signup" className="text-blue-600 font-medium ml-1">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
