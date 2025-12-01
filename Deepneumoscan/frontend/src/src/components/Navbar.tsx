import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Scan, Activity, MapPin, History, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: '/home', icon: Home, label: t('nav.home') },
    { path: '/self-assessment', icon: ClipboardList, label: t('nav.selfAssessment') },
    { path: '/xray-scan', icon: Scan, label: t('nav.xrayScan') },
    { path: '/curing-assessment', icon: Activity, label: t('nav.curingAssessment') },
    { path: '/hospital-tracker', icon: MapPin, label: t('nav.hospitalTracker') },
    { path: '/history', icon: History, label: t('nav.history') },
  ];

  if (!user) return null;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="text-2xl font-bold">
              DeepNeumoScan
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white/20 font-semibold'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <LanguageToggle />
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm">{t('nav.logout')}</span>
            </button>
          </div>
        </div>

        <div className="md:hidden pb-3 flex overflow-x-auto space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-white/20 font-semibold'
                    : 'hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
