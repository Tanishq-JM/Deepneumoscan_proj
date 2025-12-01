import { Link } from 'react-router-dom';
import { ClipboardList, Scan, Activity, MapPin, History, ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';

export const Home = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const features = [
    {
      icon: ClipboardList,
      title: t('nav.selfAssessment'),
      description: 'Answer questions about your symptoms to assess pneumonia risk',
      path: '/self-assessment',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Scan,
      title: t('nav.xrayScan'),
      description: 'Upload chest X-Ray for AI-powered pneumonia detection',
      path: '/xray-scan',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Activity,
      title: t('nav.curingAssessment'),
      description: 'Track your recovery progress and treatment effectiveness',
      path: '/curing-assessment',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: MapPin,
      title: t('nav.hospitalTracker'),
      description: 'Find specialized pneumonia care centers near your location',
      path: '/hospital-tracker',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: History,
      title: t('nav.history'),
      description: 'View your complete medical history and past assessments',
      path: '/history',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-5"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="absolute top-4 right-4">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors shadow-sm font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t('home.welcome')}, {user?.username}!
          </h1>
          <p className="text-2xl text-blue-600 font-semibold mb-2">{t('home.title')}</p>
          <p className="text-lg text-gray-600">{t('home.description')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.path}
                to={feature.path}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 hover:-translate-y-2"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                  <span>Get Started</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">About DeepNeumoScan</h2>
          <p className="text-lg leading-relaxed opacity-90">
            DeepNeumoScan is an advanced AI-powered platform designed to assist in early pneumonia detection and monitoring.
            Our system combines self-assessment tools, chest X-Ray analysis using machine learning, recovery tracking,
            and hospital location services to provide comprehensive pneumonia care management.
          </p>
        </div>
      </div>
    </div>
  );
};