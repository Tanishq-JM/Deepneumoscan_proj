// src/pages/History.tsx
import React, { useEffect, useState } from "react";
import { Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Assessment {
  id: string;
  type: string;
  score: number;
  riskLevel: string;
  createdAt: string;
}

interface XrayResult {
  id: string;
  imageUrl: string;
  prediction: string;
  confidence: number;
  createdAt: string;
}

const History: React.FC = () => {
  const { token, user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [xrayResults, setXrayResults] = useState<XrayResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!token) return;
    try {
      const response = await fetch("http://localhost:5000/api/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setAssessments(data.assessments || []);
      setXrayResults(data.xrayResults || []);
    } catch (err) {
      console.error("Error loading history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

  const handleDeleteAssessment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assessment?")) return;
    try {
      await fetch(`http://localhost:5000/api/assessments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssessments(assessments.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error deleting assessment:", err);
    }
  };

  const handleDeleteXray = async (id: string) => {
    if (!confirm("Are you sure you want to delete this X-Ray result?")) return;
    try {
      await fetch(`http://localhost:5000/api/xray/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setXrayResults(xrayResults.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Error deleting X-Ray:", err);
    }
  };

  if (!user) {
    return (
      <p className="text-center text-red-500 mt-10">
        Please login to view your history.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="p-6 max-w-4xl mx-auto">
        <Link to="/home" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
          <ArrowLeft className="mr-2" size={20} />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Medical History</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-8">
            {/* Assessments Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-blue-800">Assessments</h2>
              {assessments.length === 0 ? (
                <p className="text-gray-600 italic">No assessments found.</p>
              ) : (
                <div className="grid gap-4">
                  {assessments.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl shadow-md border border-blue-100 bg-white hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-lg text-gray-800 capitalize">
                            {item.type} Assessment
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.riskLevel?.includes('High') || item.riskLevel?.includes('Worsening') 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {item.riskLevel}
                          </div>
                          <button
                            onClick={() => handleDeleteAssessment(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700">
                        <strong>Score:</strong> {item.score}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* X-Ray Results Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-800">X-Ray Scans</h2>
              {xrayResults.length === 0 ? (
                <p className="text-gray-600 italic">No X-Ray scans found.</p>
              ) : (
                <div className="grid gap-4">
                  {xrayResults.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl shadow-md border border-green-100 bg-white hover:shadow-lg transition-shadow"
                    >
                      <div className="flex gap-4">
                        <img 
                          src={`http://localhost:5000${item.imageUrl}`} 
                          alt="X-Ray" 
                          className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-lg text-gray-800">
                                {item.prediction}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(item.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <span className="text-sm font-medium text-gray-600">Confidence</span>
                                <p className="text-lg font-bold text-blue-600">
                                  {Number(item.confidence).toFixed(1)}%
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteXray(item.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
