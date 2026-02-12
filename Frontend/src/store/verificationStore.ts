import { create } from 'zustand';

type DocumentType = 'national' | 'passport' | 'driver';

type VerificationState = {
  documentType: DocumentType;
  idFront: File | null;
  idBack: File | null;
  livePhoto: File | null;
  setDocumentType: (type: DocumentType) => void;
  setIdFront: (file: File | null) => void;
  setIdBack: (file: File | null) => void;
  setLivePhoto: (file: File | null) => void;
  reset: () => void;
};

export const useVerificationStore = create<VerificationState>((set) => ({
  documentType: 'national',
  idFront: null,
  idBack: null,
  livePhoto: null,
  setDocumentType: (type) => set({ documentType: type }),
  setIdFront: (file) => set({ idFront: file }),
  setIdBack: (file) => set({ idBack: file }),
  setLivePhoto: (file) => set({ livePhoto: file }),
  reset: () => set({ documentType: 'national', idFront: null, idBack: null, livePhoto: null })
}));

export default useVerificationStore;
