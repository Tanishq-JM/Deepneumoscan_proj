import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Navigation, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Hospital } from '../types';

export const HospitalTracker = () => {
  const { t } = useLanguage();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const mockHospitals: Hospital[] = [
    {
      name: 'City General Hospital',
      address: '123 Main Street, Downtown',
      phone: '+91 80 1234 5678',
      distance: 2.3,
      lat: 12.9716,
      lng: 77.5946,
    },
    {
      name: 'Apollo Specialty Center',
      address: '456 MG Road, Central Area',
      phone: '+91 80 2345 6789',
      distance: 3.8,
      lat: 12.9756,
      lng: 77.6006,
    },
    {
      name: 'Fortis Medical Institute',
      address: '789 Brigade Road, City Center',
      phone: '+91 80 3456 7890',
      distance: 5.2,
      lat: 12.9656,
      lng: 77.5886,
    },
    {
      name: 'Manipal Hospital',
      address: '321 Airport Road, North Zone',
      phone: '+91 80 4567 8901',
      distance: 7.1,
      lat: 12.9816,
      lng: 77.6046,
    },
    {
      name: 'Columbia Asia Hospital',
      address: '654 Outer Ring Road, East Zone',
      phone: '+91 80 5678 9012',
      distance: 9.5,
      lat: 12.9616,
      lng: 77.6146,
    },
  ];

  const handleLocateHospitals = () => {
    setLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          setTimeout(() => {
            setHospitals(mockHospitals);
            setLoading(false);
          }, 1500);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setUserLocation({ lat: 12.9716, lng: 77.5946 });
          setTimeout(() => {
            setHospitals(mockHospitals);
            setLoading(false);
          }, 1500);
        }
      );
    } else {
      setUserLocation({ lat: 12.9716, lng: 77.5946 });
      setTimeout(() => {
        setHospitals(mockHospitals);
        setLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-5"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <Link to="/home" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
              <MapPin size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('hospitalTracker.title')}</h1>
              <p className="text-gray-600">{t('hospitalTracker.subtitle')}</p>
            </div>
          </div>

          {hospitals.length === 0 ? (
            <div className="text-center py-12">
              <Navigation size={64} className="mx-auto text-red-500 mb-4" />
              <p className="text-gray-600 mb-6">
                Click the button below to find hospitals near your location
              </p>
              <button
                onClick={handleLocateHospitals}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('common.loading') : t('hospitalTracker.locate')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {hospitals.map((hospital, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-red-50 to-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-red-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{hospital.name}</h3>
                      <p className="text-gray-600 mb-3 flex items-start gap-2">
                        <MapPin size={18} className="text-red-500 mt-1 flex-shrink-0" />
                        <span>{hospital.address}</span>
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Phone size={18} className="text-red-500" />
                        <a href={`tel:${hospital.phone}`} className="hover:text-red-600 transition-colors">
                          {hospital.phone}
                        </a>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                        {hospital.distance} km
                      </div>
                      <button
                        onClick={() => {
                          window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`,
                            '_blank'
                          );
                        }}
                        className="mt-3 text-sm text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                      >
                        <Navigation size={16} />
                        Get Directions
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setHospitals([])}
                className="w-full py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Search Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
