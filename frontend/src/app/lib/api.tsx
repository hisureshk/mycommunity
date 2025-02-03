import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: process.env.BACKEND_API_URL || 'http://localhost:3000/api'
});

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        // If token exists, add it to headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        // Handle request errors
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

export const setAuthToken = (token: string) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
    } else {
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    }
};

export const login = async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
};

export const logout = () => {
    setAuthToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token'); 
  };

export const categories = async () => {
  const response = await api.get('/items/categories');
  return response.data;
};

export const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}) => {
    const response = await api.post('/users/register', userData);
    return response.data;
};

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ message: "Only POST requests allowed" }),
      { status: 405 },
    );
  }

  const data = await req.json();
  const { token } = data;
  const secretKey: string | undefined = process.env.RECAPTCHA_SECRET_KEY;

  if (!token) {
    return new Response(JSON.stringify({ message: "Token not found" }), {
      status: 405,
    });
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
    );

    if (response.data.success) {
      return new Response(JSON.stringify({ message: "Success" }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ message: "Failed to verify" }), {
        status: 405,
      });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export default api;
