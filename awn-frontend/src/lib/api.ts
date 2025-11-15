// src/lib/api.ts - النسخة الحقيقية
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    console.log('  جاري الاتصال بـ:', `${API_BASE_URL}${url}`);
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` })
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
      credentials: 'include'
    });

    console.log('📡 حالة الاستجابة:', response.status, response.statusText);

    if (response.status === 401) {
      this.handleUnauthorized();
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  private handleUnauthorized() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }

  // المواعيد - الاتصال الحقيقي
  async getAppointments() {
    return this.fetchWithAuth('/appointments');
  }

  async createAppointment(data: any) {
    return this.fetchWithAuth('/appointments', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async rescheduleAppointment(id: string, data: any) {
    return this.fetchWithAuth(`/appointments/${id}/reschedule`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async cancelAppointment(id: string) {
    return this.fetchWithAuth(`/appointments/${id}/cancel`, {
      method: 'PATCH'
    });
  }

  async submitFeedback(id: string, data: any) {
    return this.fetchWithAuth(`/appointments/${id}/feedback`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // المعالجين - الاتصال الحقيقي
  async getTherapists() {
    return this.fetchWithAuth('/therapists');
  }

  async getTherapist(id: string) {
    return this.fetchWithAuth(`/therapists/${id}`);
  }
}

export const apiService = new ApiService();