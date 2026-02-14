import { create } from 'zustand';
import campaignService, { CampaignListParams } from '../Services/campaigns';
import { getApiData, getErrorMessage } from './apiHelpers';
import type { Campaign, CampaignListResponse } from '../../types';

type CampaignRecord = Campaign;

type CampaignState = {
  campaigns: CampaignRecord[];
  featured: CampaignRecord[];
  current: CampaignRecord | null;
  nextCursor: string | null;
  isLoading: boolean;
  error: string | null;
  fetchAll: (params?: CampaignListParams, reset?: boolean) => Promise<void>;
  fetchFeatured: () => Promise<void>;
  fetchById: (id: string) => Promise<CampaignRecord | null>;
  createCampaign: (payload: unknown) => Promise<CampaignRecord | null>;
  updateCampaign: (id: string, payload: unknown) => Promise<CampaignRecord | null>;
  clearError: () => void;
};

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaigns: [],
  featured: [],
  current: null,
  nextCursor: null,
  isLoading: false,
  error: null,
  clearError: () => set({ error: null }),
  fetchAll: async (params, reset = false) => {
    set({ isLoading: true, error: null });
    try {
      const response = await campaignService.getAll(params);
      const data = getApiData<CampaignListResponse>(response);
      const campaigns = data?.data ?? [];
      console.log(campaigns)
      const nextCursor = data?.nextCursor ?? null;
      set({
        campaigns: reset ? campaigns : [...get().campaigns, ...campaigns],
        nextCursor,
        isLoading: false
      });
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
          campaigns: get().campaigns.map((item) => (item._id === id ? campaign : item)),
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
  }
}));

export default useCampaignStore;
