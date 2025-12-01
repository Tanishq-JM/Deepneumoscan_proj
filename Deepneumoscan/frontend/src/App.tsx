import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Home } from './pages/Home';
import { SelfAssessment } from './pages/SelfAssessment';
import { XRayScan } from './pages/XRayScan';
import { CuringAssessment } from './pages/CuringAssessment';
import { HospitalTracker } from './pages/HospitalTracker';
import History from './pages/History';
import { useAuth } from './hooks/useAuth';

const RootRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={user ? '/home' : '/login'} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/self-assessment"
              element={
                <ProtectedRoute>
                  <SelfAssessment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/xray-scan"
              element={
                <ProtectedRoute>
                  <XRayScan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/curing-assessment"
              element={
                <ProtectedRoute>
                  <CuringAssessment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hospital-tracker"
              element={
                <ProtectedRoute>
                  <HospitalTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
