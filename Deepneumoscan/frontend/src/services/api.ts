/// <reference types="vite/client" />
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generic helper to distinguish network vs server errors
async function handleResponse(res: Response) {
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      message = data.error || data.message || message;
    } catch {
      // ignore json parse fail
    }
    
    // Auto-logout on 403 (User not found / Invalid token)
    if (res.status === 403 || res.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    
    throw new Error(message);
  }
  try {
    return await res.json();
  } catch (e) {
    throw new Error('Invalid JSON response');
  }
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
}

export const api = {
  async login(email: string, password: string) {
    try {
      return await handleResponse(
        await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
      );
    } catch (e: any) {
      if (e.message.includes('Failed to fetch')) {
        throw new Error('Network error: backend unreachable');
      }
      throw e;
    }
  },

  async signup(username: string, email: string, password: string) {
    return handleResponse(
      await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      })
    );
  },

  async submitSelfAssessment(data: any, token: string) {
    // Backend expects POST /api/assessments with type self; adjust to unified endpoint
    const response = await fetch(`${API_BASE_URL}/assessments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ type: 'self', ...data }),
    });
    return handleResponse(response);
  },

  async uploadXRay(formData: FormData, token: string) {
    // Backend route is /api/xray (POST)
    const response = await fetch(`${API_BASE_URL}/xray`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },

  async submitCuringAssessment(data: any, token: string) {
    const response = await fetch(`${API_BASE_URL}/assessments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ type: 'curing', ...data }),
    });
    return handleResponse(response);
  },

  async getHistory(token: string) {
    const response = await fetch(`${API_BASE_URL}/history`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  async deleteRecord(type: string, id: string, token: string) {
    // Delete directly from specific collections (assessments or xray)
    const endpoint = type === 'assessment' ? 'assessments' : 'xray';
    const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse(response);
  },
};
