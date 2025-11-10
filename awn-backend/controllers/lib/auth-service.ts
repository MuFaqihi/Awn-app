// lib/auth-service.ts
class AuthService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL;
  
  async login(email: string, password: string) {
    const response = await fetch(`${this.baseURL}/auth/patient/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (data.success) {
      // حفظ token وبيانات المستخدم
      localStorage.setItem('token', data.token);
      localStorage.setItem('patient', JSON.stringify(data.patient));
      return data;
    } else {
      throw new Error(data.error);
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('patient');
  }
}

export const authService = new AuthService();