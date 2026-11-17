import api from './api';

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  confirmation: string;
}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

const authService = {
  login: async (credentials: LoginRequest) => {
    const response = await api.post('/auth/signin', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        nom: response.data.nom,
        prenom: response.data.prenom,
        email: response.data.email
      }));
    }
    return response.data;
  },

  register: async (userData: RegisterRequest) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
