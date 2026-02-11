import { create } from 'zustand';
import authService from '../Services/auth';
import userService from '../Services/users';
import { tokenStorage } from '../Services/tokenStorage';
import { getApiData, getErrorMessage } from './apiHelpers';
import type { UserProfile, UserRole } from '../../types';

type AuthUser = UserProfile;

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
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
  tokenStorage.clear();
};

const persistTokens = (accessToken: string | null, refreshToken: string | null) => {
  tokenStorage.setAccessToken(accessToken);
  tokenStorage.setRefreshToken(refreshToken);
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...(typeof window !== 'undefined' && (() => {
    window.addEventListener('auth:logout', () => {
      set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
    });
    return {};
  })()),
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  clearError: () => set({ error: null }),
  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(payload);
      const data = getApiData(response) as { user?: AuthUser; accessToken?: string; refreshToken?: string } | null;
      const token = data?.accessToken ?? null;
      const refreshToken = data?.refreshToken ?? null;
      const user = data?.user ?? null;

      persistTokens(token, refreshToken);
      set({ user, token, refreshToken, isAuthenticated: Boolean(token), isLoading: false });
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
      const response = await authService.signup(payload);
      const data = getApiData(response) as { user?: AuthUser; accessToken?: string; refreshToken?: string } | null;
      const token = data?.accessToken ?? null;
      const refreshToken = data?.refreshToken ?? null;
      const user = data?.user ?? null;

      persistTokens(token, refreshToken);
      set({ user, token, refreshToken, isAuthenticated: Boolean(token), isLoading: false });
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
      await Promise.resolve();
    } finally {
      clearStoredToken();
      set({ user: null, token: null, refreshToken: null, isAuthenticated: false, isLoading: false });
    }
  },
  loadUser: async () => {
    const token = get().token || tokenStorage.getAccessToken();
    if (!token) {
      return false;
    }

    set({ isLoading: true, error: null, isAuthenticated: true, token });
    try {
      const response = await authService.me();
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
    const token = tokenStorage.getAccessToken();
    const refreshToken = tokenStorage.getRefreshToken();
    if (!token && !refreshToken) {
      return;
    }

    set({ token: token ?? null, refreshToken: refreshToken ?? null, isAuthenticated: Boolean(token) });
    await get().loadUser();
  },
}));

export default useAuthStore;
