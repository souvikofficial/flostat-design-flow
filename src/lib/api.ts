// src/lib/api.ts
const API_BASE_URL = '/api/v1';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName?: string;
}

interface GoogleAuthData {
  tokenId: string;
}

interface CreateDeviceData {
  device_type: string;
  org_id: string;
}

interface CreateOrgData {
  orgName: string;
  orgDesc: string;
  location: string;
}

interface DeviceToken {
  token_id: string;
  device_id: string;
  org_id: string;
  used: boolean;
  created_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  navigateTo?: string;
  state?: string;
  token?: string | DeviceToken;
  users?: T;
  devices?: T;
  orgs?: T;
  org_id?: string;
  org?: T;
}

// Helper function to get token from localStorage or cookies
const getToken = () => {
  // Try to get token from localStorage first
  const token = localStorage.getItem('authToken');
  if (token) return token;
  
  // If not in localStorage, try to get from cookies
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'access_token') {
      return value;
    }
  }
  
  return null;
};

export const api = {
  auth: {
    login: async (credentials: LoginCredentials): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      return response.json();
    },
    
    signUp: async (data: SignUpData): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/auth/signUp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return response.json();
    },
    
    sendOtp: async (email: string): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/auth/sendOtp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      return response.json();
    },
    
    verifyOtp: async (email: string, otp: string): Promise<ApiResponse<any>> => {
      const response = await fetch(`${API_BASE_URL}/auth/verifyOtp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      
      return response.json();
    },
    
    googleOuth: async (data: GoogleAuthData): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/googleOuth/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        return response.json();
      } catch (error) {
        console.error('Error in googleOuth API call:', error);
        throw error;
      }
    }
  },
  
  users: {
    getAll: async (): Promise<ApiResponse<any>> => {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/user/getAll/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      });
      
      return response.json();
    }
  },
  
  organizations: {
    getAll: async (): Promise<ApiResponse<any>> => {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/org/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      });
      
      return response.json();
    },
    
    getUserOrgs: async (): Promise<ApiResponse<any>> => {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/user/getOrgsUser/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      });
      
      return response.json();
    },
    
    create: async (data: CreateOrgData): Promise<ApiResponse<any>> => {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/org/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(data),
      });
      
      return response.json();
    }
  },
  
  devices: {
    getAll: async (): Promise<ApiResponse<any>> => {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/device/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      });
      
      return response.json();
    },
    
    create: async (data: CreateDeviceData): Promise<ApiResponse<any>> => {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/device/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(data),
      });
      
      return response.json();
    }
  },
  
  reports: {
    getAll: async (): Promise<ApiResponse<any>> => {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/report/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
      });
      
      return response.json();
    }
  }
};