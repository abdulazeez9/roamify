import { create } from 'zustand';

interface CommunityStore {
  activeTab: 'posts' | 'about';
  setActiveTab: (tab: 'posts' | 'about') => void;
}

export const useCommunityStore = create<CommunityStore>((set) => ({
  activeTab: 'posts',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
