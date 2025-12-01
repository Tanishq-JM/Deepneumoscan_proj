export interface User {
  _id: string;
  username: string;
  email: string;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface AssessmentAnswer {
  question: string;
  answer: string;
  score: number;
}

export interface SelfAssessmentResult {
  _id?: string;
  userId: string;
  answers: AssessmentAnswer[];
  totalScore: number;
  riskLevel: string;
  date: string;
}

export interface XRayResult {
  _id?: string;
  userId: string;
  imageUrl: string;
  age: number;
  gender: string;
  smoking: boolean;
  medicalHistory: string;
  prediction: string;
  confidence: number;
  model: string;
  date: string;
}

export interface CuringAssessment {
  _id?: string;
  userId: string;
  answers: AssessmentAnswer[];
  recoveryStatus: string;
  date: string;
}

export interface Hospital {
  name: string;
  address: string;
  phone: string;
  distance: number;
  lat: number;
  lng: number;
}

export interface Translation {
  [key: string]: string | Translation;
}
