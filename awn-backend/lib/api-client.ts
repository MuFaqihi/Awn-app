const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL = API_BASE;

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (response.status === 401) {
      // Token منتهي أو غير صالح
      localStorage.removeItem('token');
      localStorage.removeItem('patient');
      window.location.href = '/login';
      throw new Error('انتهت الجلسة');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'فشل في الاتصال بالخادم');
    }

    return data;
  }


  // بيانات المريض
  async getPatientProfile() {
    return this.request('/patients/profile');
  }

  async updatePatientProfile(profileData: any) {
    return this.request('/patients/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // حجوزات المريض
  async getPatientBookings(status?: string) {
    const url = status ? `/patients/bookings?status=${status}` : '/patients/bookings';
    return this.request(url);
  }

  async cancelBooking(bookingId: string, reason: string) {
    return this.request(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ 
        cancellation_reason: reason,
        cancelled_by: 'patient'
      })
    });
  }

  async rescheduleBooking(bookingId: string, data: any) {
    return this.request(`/bookings/${bookingId}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async changePassword(passwordData: any) {
    return this.request('/patients/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData)
    });
  }

  async patientLogin(email: string, password: string) {
    const response = await fetch(`${this.baseURL}/auth/patient/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('patient', JSON.stringify(data.patient));
    }
    
    return data;
  }

  async patientRegister(patientData: any) {
    const response = await fetch(`${this.baseURL}/auth/patient/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    });

    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('patient', JSON.stringify(data.patient));
    }
    
    return data;
  }

  // المعالجين (عام)
  async getTherapists() {
    const response = await fetch(`${this.baseURL}/therapists`);
    return response.json();
  }

  async getTherapistById(id: string) {
    const response = await fetch(`${this.baseURL}/therapists/${id}`);
    return response.json();
  }


  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  getCurrentPatient() {
    const patient = localStorage.getItem('patient');
    return patient ? JSON.parse(patient) : null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('patient');
    window.location.href = '/';
  }
}

export const apiClient = new ApiClient();