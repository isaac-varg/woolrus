import { create } from 'zustand'

type Views = 'display' | 'addPackage' | 'packageDetails'

interface PackageState {
  view: Views
  selectedPackageId: string | null
}

interface PackageActions {
  actions: {
    setView: (view: Views) => void;
    clearSelectedPackage: () => void;
    openPackageDetails: (packageId: string) => void;
  }
}

export const usePackage = create<PackageState & PackageActions>((set, get) => ({
  view: 'display',
  selectedPackageId: null,

  actions: {
    setView: (view) => set(() => ({ view })),
    clearSelectedPackage: () => set(() => ({ selectedPackageId: null })),
    openPackageDetails: (packageId) => set(() => ({ view: 'packageDetails', selectedPackageId: packageId })),
  }

}))

export const usePackageActions = () => usePackage((state) => state.actions)
