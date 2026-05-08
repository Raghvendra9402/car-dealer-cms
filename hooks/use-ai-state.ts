import { create } from "zustand";

interface AIStateProps {
  isLoading: boolean;
  setIsLoading: (prev: boolean) => void;
  s3Keys: string[];
  imageSignedUrls: string[];
  setS3Keys: (keys: string[]) => void;
  setImageSignedUrls: (urls: string[]) => void;
  draftId: string;
  setDraftId: (id: string) => void;
  reset: () => void;
}

export const useAIState = create<AIStateProps>((set) => ({
  isLoading: false,
  setIsLoading: (value) => set({ isLoading: value }),
  s3Keys: [],
  imageSignedUrls: [],
  setS3Keys: (keys: string[]) => set({ s3Keys: keys }),
  setImageSignedUrls: (urls: string[]) => set({ imageSignedUrls: urls }),
  draftId: "",
  setDraftId: (id) => set({ draftId: id }),
  reset: () => set({ s3Keys: [], imageSignedUrls: [] }),
}));
