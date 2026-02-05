import { create } from 'zustand';
import authService from '../Services/auth';
import userService from '../Services/users';
import { getApiData, getErrorMessage } from './apiHelpers';

type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  createdAt?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  loadUser: () => Promise<boolean>;
  initialize: () => Promise<void>;
  clearError: () => void;
};

const clearStoredToken = () => {
  localStorage.removeItem('authToken');
};

const persistToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    clearStoredToken();
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  clearError: () => set({ error: null }),
  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(payload);
      const data = getApiData(response) as { user?: AuthUser; token?: string } | null;
      const token = data?.token ?? null;
      const user = data?.user ?? null;

      persistToken(token);
      set({ user, token, isAuthenticated: Boolean(token), isLoading: false });
      return Boolean(token);
    } catch (error) {
      clearStoredToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: getErrorMessage(error),
      });
      return false;
    }
  },
  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(payload);
      const data = getApiData(response) as { user?: AuthUser; token?: string } | null;
      const token = data?.token ?? null;
      const user = data?.user ?? null;

      persistToken(token);
      set({ user, token, isAuthenticated: Boolean(token), isLoading: false });
      return Boolean(token);
    } catch (error) {
      clearStoredToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: getErrorMessage(error),
      });
      return false;
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout();
    } finally {
      clearStoredToken();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
  loadUser: async () => {
    const token = get().token || localStorage.getItem('authToken');
    if (!token) {
      return false;
    }

    set({ isLoading: true, error: null, isAuthenticated: true, token });
    try {
      const response = await userService.getMe();
      const user = getApiData(response) as AuthUser | null;
      set({ user: user ?? null, isLoading: false });
      return Boolean(user);
    } catch (error) {
      clearStoredToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: getErrorMessage(error),
      });
      return false;
    }
  },
  initialize: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return;
    }

    set({ token, isAuthenticated: true });
    await get().loadUser();
  },
}));

export default useAuthStore;
