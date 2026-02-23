import { create } from 'zustand'

type Views = 'display' | 'packageDetails'

interface QAState {
  view: Views
  selectedPackageId: string | null
}

interface QAActions {
  actions: {
    setView: (view: Views) => void;
    clearSelectedPackage: () => void;
    openPackageDetails: (packageId: string) => void;
  }
}

export const useQA = create<QAState & QAActions>((set) => ({
  view: 'display',
  selectedPackageId: null,

  actions: {
    setView: (view) => set(() => ({ view })),
    clearSelectedPackage: () => set(() => ({ selectedPackageId: null })),
    openPackageDetails: (packageId) => set(() => ({ view: 'packageDetails', selectedPackageId: packageId })),
  }

}))

export const useQAActions = () => useQA((state) => state.actions)
