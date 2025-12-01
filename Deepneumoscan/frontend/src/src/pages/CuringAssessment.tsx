import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Activity, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

interface Question {
  id: number;
  question: string;
  questionKn: string;
  options: { text: string; textKn: string; score: number }[];
}

export const CuringAssessment = () => {
  const { user, token } = useAuth();
  const { t, language } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      question: 'How has your cough changed since starting treatment?',
      questionKn: 'ಚಿಕಿತ್ಸೆ ಪ್ರಾರಂಭಿಸಿದ ನಂತರ ನಿಮ್ಮ ಕೆಮ್ಮು ಹೇಗೆ ಬದಲಾಗಿದೆ?',
      options: [
        { text: 'Much better', textKn: 'ತುಂಬಾ ಉತ್ತಮ', score: 2 },
        { text: 'Slightly better', textKn: 'ಸ್ವಲ್ಪ ಉತ್ತಮ', score: 1 },
        { text: 'No change', textKn: 'ಬದಲಾವಣೆ ಇಲ್ಲ', score: 0 },
        { text: 'Worse', textKn: 'ಕೆಟ್ಟದಾಗಿದೆ', score: -1 },
      ],
    },
    {
      id: 2,
      question: 'How is your breathing now?',
      questionKn: 'ಈಗ ನಿಮ್ಮ ಉಸಿರಾಟ ಹೇಗಿದೆ?',
      options: [
        { text: 'Much easier', textKn: 'ತುಂಬಾ ಸುಲಭ', score: 2 },
        { text: 'Slightly easier', textKn: 'ಸ್ವಲ್ಪ ಸುಲಭ', score: 1 },
        { text: 'No change', textKn: 'ಬದಲಾವಣೆ ಇಲ್ಲ', score: 0 },
        { text: 'More difficult', textKn: 'ಹೆಚ್ಚು ಕಷ್ಟ', score: -1 },
      ],
    },
    {
      id: 3,
      question: 'How is your energy level?',
      questionKn: 'ನಿಮ್ಮ ಶಕ್ತಿಯ ಮಟ್ಟ ಹೇಗಿದೆ?',
      options: [
        { text: 'Much better', textKn: 'ತುಂಬಾ ಉತ್ತಮ', score: 2 },
        { text: 'Slightly better', textKn: 'ಸ್ವಲ್ಪ ಉತ್ತಮ', score: 1 },
        { text: 'No change', textKn: 'ಬದಲಾವಣೆ ಇಲ್ಲ', score: 0 },
        { text: 'Lower', textKn: 'ಕಡಿಮೆ', score: -1 },
      ],
    },
    {
      id: 4,
      question: 'Have you been taking medications as prescribed?',
      questionKn: 'ನೀವು ಸೂಚಿಸಿದಂತೆ ಔಷಧಿಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?',
      options: [
        { text: 'Always', textKn: 'ಯಾವಾಗಲೂ', score: 2 },
        { text: 'Mostly', textKn: 'ಹೆಚ್ಚಾಗಿ', score: 1 },
        { text: 'Sometimes', textKn: 'ಕೆಲವೊಮ್ಮೆ', score: 0 },
        { text: 'Rarely', textKn: 'ಅಪರೂಪವಾಗಿ', score: -1 },
      ],
    },
    {
      id: 5,
      question: 'How is your appetite?',
      questionKn: 'ನಿಮ್ಮ ಹಸಿವು ಹೇಗಿದೆ?',
      options: [
        { text: 'Much better', textKn: 'ತುಂಬಾ ಉತ್ತಮ', score: 2 },
        { text: 'Slightly better', textKn: 'ಸ್ವಲ್ಪ ಉತ್ತಮ', score: 1 },
        { text: 'No change', textKn: 'ಬದಲಾವಣೆ ಇಲ್ಲ', score: 0 },
        { text: 'Worse', textKn: 'ಕೆಟ್ಟದಾಗಿದೆ', score: -1 },
      ],
    },
    {
      id: 6,
      question: 'How is your chest pain?',
      questionKn: 'ನಿಮ್ಮ ಎದೆ ನೋವು ಹೇಗಿದೆ?',
      options: [
        { text: 'Gone', textKn: 'ಹೋಗಿದೆ', score: 2 },
        { text: 'Less', textKn: 'ಕಡಿಮೆ', score: 1 },
        { text: 'Same', textKn: 'ಅದೇ', score: 0 },
        { text: 'Worse', textKn: 'ಕೆಟ್ಟದಾಗಿದೆ', score: -1 },
      ],
    },
    {
      id: 7,
      question: 'How is your fever?',
      questionKn: 'ನಿಮ್ಮ ಜ್ವರ ಹೇಗಿದೆ?',
      options: [
        { text: 'No fever', textKn: 'ಜ್ವರ ಇಲ್ಲ', score: 2 },
        { text: 'Occasional low fever', textKn: 'ಕೆಲವೊಮ್ಮೆ ಕಡಿಮೆ ಜ್ವರ', score: 1 },
        { text: 'Same', textKn: 'ಅದೇ', score: 0 },
        { text: 'Higher', textKn: 'ಹೆಚ್ಚು', score: -1 },
      ],
    },
    {
      id: 8,
      question: 'How is the quality of your sleep?',
      questionKn: 'ನಿಮ್ಮ ನಿದ್ರೆಯ ಗುಣಮಟ್ಟ ಹೇಗಿದೆ?',
      options: [
        { text: 'Much better', textKn: 'ತುಂಬಾ ಉತ್ತಮ', score: 2 },
        { text: 'Slightly better', textKn: 'ಸ್ವಲ್ಪ ಉತ್ತಮ', score: 1 },
        { text: 'No change', textKn: 'ಬದಲಾವಣೆ ಇಲ್ಲ', score: 0 },
        { text: 'Worse', textKn: 'ಕೆಟ್ಟದಾಗಿದೆ', score: -1 },
      ],
    },
    {
      id: 9,
      question: 'Are you able to do daily activities?',
      questionKn: 'ನೀವು ದೈನಂದಿನ ಚಟುವಟಿಕೆಗಳನ್ನು ಮಾಡಲು ಸಾಧ್ಯವಾಗುತ್ತಿದೆಯೇ?',
      options: [
        { text: 'Yes, easily', textKn: 'ಹೌದು, ಸುಲಭವಾಗಿ', score: 2 },
        { text: 'With some effort', textKn: 'ಸ್ವಲ್ಪ ಪ್ರಯತ್ನದಿಂದ', score: 1 },
        { text: 'With difficulty', textKn: 'ಕಷ್ಟದಿಂದ', score: 0 },
        { text: 'No', textKn: 'ಇಲ್ಲ', score: -1 },
      ],
    },
    {
      id: 10,
      question: 'How would you rate your overall recovery?',
      questionKn: 'ನಿಮ್ಮ ಒಟ್ಟಾರೆ ಚೇತರಿಕೆಯನ್ನು ನೀವು ಹೇಗೆ ರೇಟ್ ಮಾಡುತ್ತೀರಿ?',
      options: [
        { text: 'Excellent', textKn: 'ಅತ್ಯುತ್ತಮ', score: 2 },
        { text: 'Good', textKn: 'ಒಳ್ಳೆಯದು', score: 1 },
        { text: 'Fair', textKn: 'ಸಮಾನ', score: 0 },
        { text: 'Poor', textKn: 'ಕಳಪೆ', score: -1 },
      ],
    },
  ];

  const handleAnswerChange = (questionId: number, score: number) => {
    setAnswers({ ...answers, [questionId]: score });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Curing Assessment Submit clicked. Answers:', answers, 'Questions length:', questions.length);
    
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }
    
    setLoading(true);

    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);

    let recoveryStatus = '';
    if (totalScore >= 12) recoveryStatus = t('curingAssessment.improving');
    else if (totalScore >= 5) recoveryStatus = t('curingAssessment.stable');
    else recoveryStatus = t('curingAssessment.worsening');

    const assessmentData = {
      answers: questions.map((q) => ({
        question: language === 'en' ? q.question : q.questionKn,
        answer: q.options.find((opt) => opt.score === answers[q.id])?.text || '',
        score: answers[q.id] || 0,
      })),
      score: totalScore,
      riskLevel: recoveryStatus,
      recoveryStatus,
    };

    try {
      console.log('Submitting curing assessment:', assessmentData);
      await api.submitCuringAssessment(assessmentData, token!);
      console.log('Curing assessment submitted successfully');
      setResult(recoveryStatus);
    } catch (error) {
      console.error('Failed to submit curing assessment:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
            <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
              <Activity size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('curingAssessment.title')}</h1>
              <p className="text-gray-600">{t('curingAssessment.subtitle')}</p>
            </div>
          </div>

          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {questions[currentQuestion].id}. {language === 'en' ? questions[currentQuestion].question : questions[currentQuestion].questionKn}
                </h3>
                <div className="space-y-2">
                  {questions[currentQuestion].options.map((option, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-orange-100 transition-colors ${
                        answers[questions[currentQuestion].id] === option.score ? 'ring-2 ring-orange-500' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${questions[currentQuestion].id}`}
                        value={option.score}
                        checked={answers[questions[currentQuestion].id] === option.score}
                        onChange={() => handleAnswerChange(questions[currentQuestion].id, option.score)}
                        className="w-4 h-4 text-orange-600"
                        required
                      />
                      <span className="text-gray-700">
                        {language === 'en' ? option.text : option.textKn}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                
                {currentQuestion < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={answers[questions[currentQuestion].id] === undefined}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || answers[questions[currentQuestion].id] === undefined}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? t('common.loading') : t('common.submit')}
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <CheckCircle size={64} className="mx-auto text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">{t('curingAssessment.results')}</h2>
              <div className="bg-orange-50 rounded-xl p-6">
                <p className="text-xl font-bold">
                  <span
                    className={
                      result === t('curingAssessment.improving')
                        ? 'text-green-600'
                        : result === t('curingAssessment.stable')
                        ? 'text-blue-600'
                        : 'text-red-600'
                    }
                  >
                    {result}
                  </span>
                </p>
              </div>
              <button
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                }}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
              >
                Take Another Assessment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
