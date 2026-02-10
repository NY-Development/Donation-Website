import { create } from 'zustand';
import donationService from '../Services/donations';
import userService from '../Services/users';
import { getApiData, getErrorMessage } from './apiHelpers';
import type { UserDashboard } from '../types';

type DonationState = {
  timeline: UserDashboard['timeline'];
  totalDonated: number;
  campaignsSupported: number;
  nextCursor: string | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboard: (params?: { limit?: number; cursor?: string }, reset?: boolean) => Promise<void>;
  createCheckout: (payload: { campaignId: string; amount: number }) => Promise<string | null>;
  clearError: () => void;
};

export const useDonationStore = create<DonationState>((set, get) => ({
  timeline: [],
  totalDonated: 0,
  campaignsSupported: 0,
  nextCursor: null,
  isLoading: false,
  error: null,
  clearError: () => set({ error: null }),
  fetchDashboard: async (params, reset = false) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.getDashboard(params);
      const data = getApiData<UserDashboard>(response);
      set({
        totalDonated: data?.totalDonated ?? 0,
        campaignsSupported: data?.campaignsSupported ?? 0,
        nextCursor: data?.nextCursor ?? null,
        timeline: reset ? data?.timeline ?? [] : [...get().timeline, ...(data?.timeline ?? [])],
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
    }
  },
  createCheckout: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await donationService.createCheckout(payload);
      const data = getApiData<{ clientSecret?: string }>(response);
      set({ isLoading: false });
      return data?.clientSecret ?? null;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      return null;
    }
  }
}));

export default useDonationStore;
