import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Home, 
  FileText, 
  Scan, 
  TrendingUp, 
  MapPin, 
  History, 
  LogOut,
  Languages,
  Stethoscope
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/self-assessment', icon: FileText, label: t('nav.selfAssessment') },
    { path: '/xray-scan', icon: Scan, label: t('nav.xrayScan') },
    { path: '/curing-assessment', icon: TrendingUp, label: t('nav.curingAssessment') },
    { path: '/hospital-tracker', icon: MapPin, label: t('nav.hospitalTracker') },
    { path: '/history', icon: History, label: t('nav.history') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <nav className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Deepneumoscan
                </h1>
                <p className="text-sm text-gray-600">AI Medical Diagnostics</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors">
                <Languages className="h-4 w-4 text-gray-600" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'kn')}
                  className="text-sm bg-transparent border-none focus:ring-0 focus:outline-none cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="kn">ಕನ್ನಡ</option>
                </select>
              </div>
              
              <span className="text-gray-700 font-medium hidden sm:inline">{user?.username}</span>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-red-600 transition-colors bg-gray-50 hover:bg-red-50 rounded-lg p-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm hidden sm:inline">{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white/80 backdrop-blur-sm shadow-lg min-h-[calc(100vh-80px)] sticky top-20 hidden lg:block">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-2xl border-t border-blue-100 z-50 safe-area-inset-bottom">
          <nav className="flex justify-around py-3 px-2">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-xs font-medium truncate w-full text-center">{item.label.split(' ')[0]}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Layout;