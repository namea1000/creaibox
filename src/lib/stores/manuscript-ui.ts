import { create } from 'zustand';

export type ManuscriptStatusTab = 'all' | 'draft' | 'saved' | 'published';

interface ManuscriptUiState {
  creaiboxSearchTerm: string;
  creaiboxStatusTab: ManuscriptStatusTab;
  creaiboxCurrentPage: number;
  naverSearchTerm: string;
  naverStatusTab: ManuscriptStatusTab;
  naverCurrentPage: number;
  setCreaiboxSearchTerm: (term: string) => void;
  setCreaiboxStatusTab: (tab: ManuscriptStatusTab) => void;
  setCreaiboxCurrentPage: (page: number) => void;
  setNaverSearchTerm: (term: string) => void;
  setNaverStatusTab: (tab: ManuscriptStatusTab) => void;
  setNaverCurrentPage: (page: number) => void;
}

export const useManuscriptUiStore = create<ManuscriptUiState>((set) => ({
  creaiboxSearchTerm: '',
  creaiboxStatusTab: 'all',
  creaiboxCurrentPage: 1,
  naverSearchTerm: '',
  naverStatusTab: 'all',
  naverCurrentPage: 1,
  setCreaiboxSearchTerm: (term) => set({ creaiboxSearchTerm: term, creaiboxCurrentPage: 1 }),
  setCreaiboxStatusTab: (tab) => set({ creaiboxStatusTab: tab, creaiboxCurrentPage: 1 }),
  setCreaiboxCurrentPage: (page) => set({ creaiboxCurrentPage: page }),
  setNaverSearchTerm: (term) => set({ naverSearchTerm: term, naverCurrentPage: 1 }),
  setNaverStatusTab: (tab) => set({ naverStatusTab: tab, naverCurrentPage: 1 }),
  setNaverCurrentPage: (page) => set({ naverCurrentPage: page }),
}));
