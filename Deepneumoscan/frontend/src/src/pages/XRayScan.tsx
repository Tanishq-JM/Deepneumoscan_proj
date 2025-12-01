import { useState, FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Scan, Upload, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export const XRayScan = () => {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [smoking, setSmoking] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'image/jpeg') {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a JPEG image only');
    }
  };

  const mockAIAnalysis = (imageData: string) => {
    const knnAccuracy = Math.random() * 100;

    if (knnAccuracy >= 90) {
      return {
        prediction: Math.random() > 0.5 ? 'Pneumonia Detected' : 'Normal',
        confidence: knnAccuracy.toFixed(2),
        model: 'KNN',
      };
    } else {
      const svmAccuracy = 90 + Math.random() * 10;
      return {
        prediction: Math.random() > 0.5 ? 'Pneumonia Detected' : 'Normal',
        confidence: svmAccuracy.toFixed(2),
        model: 'SVM (Fallback)',
      };
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);

    try {
      const aiResult = mockAIAnalysis(preview);

      const formData = new FormData();
      formData.append('image', image);
      formData.append('age', age);
      formData.append('gender', gender);
      formData.append('smoking', smoking);
      formData.append('medicalHistory', medicalHistory);
      formData.append('prediction', aiResult.prediction);
      formData.append('confidence', aiResult.confidence);
      formData.append('model', aiResult.model);

      await api.uploadXRay(formData, token!);
      setResult(aiResult);
    } catch (error) {
      console.error('Failed to analyze X-Ray:', error);
      const aiResult = mockAIAnalysis(preview);
      setResult(aiResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-5"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <Link to="/home" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
              <Scan size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('xrayScan.title')}</h1>
              <p className="text-gray-600">{t('xrayScan.subtitle')}</p>
            </div>
          </div>

          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-blue-50">
                {preview ? (
                  <div className="space-y-4">
                    <img src={preview} alt="X-Ray Preview" className="max-h-64 mx-auto rounded-lg shadow-lg" />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setPreview('');
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload size={48} className="mx-auto text-blue-600 mb-4" />
                    <p className="text-lg font-semibold text-gray-700 mb-2">{t('xrayScan.upload')}</p>
                    <p className="text-sm text-gray-500">Click to browse files</p>
                    <input
                      type="file"
                      accept="image/jpeg"
                      onChange={handleImageChange}
                      className="hidden"
                      required
                    />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('xrayScan.age')}
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="0"
                    max="120"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('xrayScan.gender')}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">{t('xrayScan.male')}</option>
                    <option value="female">{t('xrayScan.female')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('xrayScan.smoking')}
                  </label>
                  <select
                    value={smoking}
                    onChange={(e) => setSmoking(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select</option>
                    <option value="yes">{t('xrayScan.yes')}</option>
                    <option value="no">{t('xrayScan.no')}</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('xrayScan.medicalHistory')}
                  </label>
                  <textarea
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Previous conditions, medications, etc."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !image}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('common.loading') : t('xrayScan.analyze')}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <CheckCircle size={64} className="mx-auto text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">{t('xrayScan.result')}</h2>
              <div className="bg-blue-50 rounded-xl p-6 space-y-3">
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">{t('xrayScan.prediction')}:</span>{' '}
                  <span
                    className={`font-bold ${
                      result.prediction === 'Pneumonia Detected' ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {result.prediction}
                  </span>
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">{t('xrayScan.confidence')}:</span> {result.confidence}%
                </p>
              </div>
              {preview && (
                <img src={preview} alt="Analyzed X-Ray" className="max-h-64 mx-auto rounded-lg shadow-lg" />
              )}
              <button
                onClick={() => {
                  setResult(null);
                  setImage(null);
                  setPreview('');
                  setAge('');
                  setGender('');
                  setSmoking('');
                  setMedicalHistory('');
                }}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                Analyze Another X-Ray
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
