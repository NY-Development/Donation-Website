import { create } from 'zustand';
import donationService from '../Services/donations';
import { getApiData, getErrorMessage } from './apiHelpers';
import type { Donation } from '../types';

type DonationRecord = Donation & Record<string, unknown>;

type PaginatedDonations = {
  donations: DonationRecord[];
  pagination?: Record<string, unknown>;
};

type DonationState = {
  donations: DonationRecord[];
  userHistory: DonationRecord[];
  current: DonationRecord | null;
  stats: Record<string, unknown> | null;
  isLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  fetchById: (id: string) => Promise<DonationRecord | null>;
  fetchUserHistory: () => Promise<void>;
  fetchStats: () => Promise<void>;
  createDonation: (payload: unknown) => Promise<DonationRecord | null>;
  clearError: () => void;
};

export const useDonationStore = create<DonationState>((set, get) => ({
  donations: [],
  userHistory: [],
  current: null,
  stats: null,
  isLoading: false,
  error: null,
  clearError: () => set({ error: null }),
  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await donationService.getAll();
      const data = getApiData<PaginatedDonations | DonationRecord[]>(response);
      const donations = Array.isArray(data) ? data : data?.donations ?? [];
      set({ donations, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
    }
  },
  fetchById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await donationService.getById(id);
      const donation = getApiData<DonationRecord>(response);
      set({ current: donation ?? null, isLoading: false });
      return donation ?? null;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      return null;
    }
  },
  fetchUserHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await donationService.getUserHistory();
      const data = getApiData<PaginatedDonations | DonationRecord[]>(response);
      const donations = Array.isArray(data) ? data : data?.donations ?? [];
      set({ userHistory: donations, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
    }
  },
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await donationService.getStats();
      const stats = getApiData<Record<string, unknown>>(response);
      set({ stats: stats ?? null, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
    }
  },
  createDonation: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await donationService.create(payload);
      const donation = getApiData<DonationRecord>(response);
      if (donation) {
        set({
          donations: [donation, ...get().donations],
          userHistory: [donation, ...get().userHistory],
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
      return donation ?? null;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      return null;
    }
  },
}));

export default useDonationStore;
