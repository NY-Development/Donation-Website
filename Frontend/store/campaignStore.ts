import { create } from 'zustand';
import campaignService from '../Services/campaigns';
import { getApiData, getErrorMessage } from './apiHelpers';
import type { Campaign } from '../types';

type CampaignRecord = Campaign & Record<string, unknown>;

type PaginatedCampaigns = {
  campaigns: CampaignRecord[];
  pagination?: Record<string, unknown>;
};

type CampaignState = {
  campaigns: CampaignRecord[];
  featured: CampaignRecord[];
  current: CampaignRecord | null;
  isLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  fetchFeatured: () => Promise<void>;
  fetchById: (id: string) => Promise<CampaignRecord | null>;
  createCampaign: (payload: unknown) => Promise<CampaignRecord | null>;
  updateCampaign: (id: string, payload: unknown) => Promise<CampaignRecord | null>;
  deleteCampaign: (id: string) => Promise<boolean>;
  clearError: () => void;
};

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaigns: [],
  featured: [],
  current: null,
  isLoading: false,
  error: null,
  clearError: () => set({ error: null }),
  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await campaignService.getAll();
      const data = getApiData<PaginatedCampaigns | CampaignRecord[]>(response);
      const campaigns = Array.isArray(data) ? data : data?.campaigns ?? [];
      set({ campaigns, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
    }
  },
  fetchFeatured: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await campaignService.getFeatured();
      const data = getApiData<CampaignRecord[]>(response);
      set({ featured: data ?? [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
    }
  },
  fetchById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await campaignService.getById(id);
      const campaign = getApiData<CampaignRecord>(response);
      set({ current: campaign ?? null, isLoading: false });
      return campaign ?? null;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      return null;
    }
  },
  createCampaign: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await campaignService.create(payload);
      const campaign = getApiData<CampaignRecord>(response);
      if (campaign) {
        set({ campaigns: [campaign, ...get().campaigns], isLoading: false });
      } else {
        set({ isLoading: false });
      }
      return campaign ?? null;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      return null;
    }
  },
  updateCampaign: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await campaignService.update(id, payload);
      const campaign = getApiData<CampaignRecord>(response);
      if (campaign) {
        set({
          campaigns: get().campaigns.map((item) => (item.id === id ? campaign : item)),
          current: campaign,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
      return campaign ?? null;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      return null;
    }
  },
  deleteCampaign: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await campaignService.delete(id);
      set({
        campaigns: get().campaigns.filter((item) => item.id !== id),
        current: get().current?.id === id ? null : get().current,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      return false;
    }
  },
}));

export default useCampaignStore;
