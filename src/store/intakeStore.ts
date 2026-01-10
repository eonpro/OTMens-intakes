// ============================================================
// ENTERPRISE INTAKE STORE - Zustand with Persistence
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  IntakeData, 
  PersonalInfo, 
  AddressInfo, 
  MedicalProfile, 
  MedicalHistory, 
  GLP1Profile,
  WeightInfo,
  ResponseValue 
} from '@/types/form';

// Generate unique session ID
function generateSessionId(): string {
  return `EON-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

// Initial state factory
function createInitialState(): IntakeData {
  return {
    sessionId: generateSessionId(),
    currentStep: '',
    completedSteps: [],
    startedAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
    personalInfo: {},
    address: {},
    medicalProfile: {},
    medicalHistory: {},
    glp1Profile: {},
    responses: {},
    qualified: undefined,
    disqualificationReason: undefined,
  };
}

// ============================================================
// STORE INTERFACE
// ============================================================

interface IntakeStore extends IntakeData {
  // Navigation actions
  setCurrentStep: (stepId: string) => void;
  markStepCompleted: (stepId: string) => void;
  goBack: () => string | null;
  
  // Data actions
  setResponse: (key: string, value: ResponseValue) => void;
  setResponses: (responses: Record<string, ResponseValue>) => void;
  setPersonalInfo: (info: Partial<PersonalInfo>) => void;
  setAddress: (address: Partial<AddressInfo>) => void;
  setMedicalProfile: (profile: Partial<MedicalProfile>) => void;
  setMedicalHistory: (history: Partial<MedicalHistory>) => void;
  setGLP1Profile: (profile: Partial<GLP1Profile>) => void;
  setWeight: (weight: Partial<WeightInfo>) => void;
  
  // Qualification
  setQualified: (qualified: boolean, reason?: string) => void;
  
  // Session management
  resetIntake: () => void;
  getIntakeData: () => IntakeData;
  
  // Computed values
  getBMI: () => number | null;
  getProgress: (totalSteps: number) => number;
  isStepCompleted: (stepId: string) => boolean;
}

// ============================================================
// STORE IMPLEMENTATION
// ============================================================

export const useIntakeStore = create<IntakeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...createInitialState(),

      // ========== NAVIGATION ==========
      
      setCurrentStep: (stepId: string) => {
        set({ 
          currentStep: stepId,
          lastUpdatedAt: new Date().toISOString()
        });
      },

      markStepCompleted: (stepId: string) => {
        const { completedSteps } = get();
        if (!completedSteps.includes(stepId)) {
          set({ 
            completedSteps: [...completedSteps, stepId],
            lastUpdatedAt: new Date().toISOString()
          });
        }
      },

      goBack: () => {
        const { completedSteps } = get();
        if (completedSteps.length > 0) {
          const previousStep = completedSteps[completedSteps.length - 1];
          // Remove from completed and set as current
          set({
            currentStep: previousStep,
            completedSteps: completedSteps.slice(0, -1),
            lastUpdatedAt: new Date().toISOString()
          });
          return previousStep;
        }
        return null;
      },

      // ========== DATA ACTIONS ==========
      
      setResponse: (key: string, value: ResponseValue) => {
        set((state) => ({
          responses: { ...state.responses, [key]: value },
          lastUpdatedAt: new Date().toISOString()
        }));
      },

      setResponses: (responses: Record<string, ResponseValue>) => {
        set((state) => ({
          responses: { ...state.responses, ...responses },
          lastUpdatedAt: new Date().toISOString()
        }));
      },

      setPersonalInfo: (info: Partial<PersonalInfo>) => {
        set((state) => ({
          personalInfo: { ...state.personalInfo, ...info },
          lastUpdatedAt: new Date().toISOString()
        }));
      },

      setAddress: (address: Partial<AddressInfo>) => {
        set((state) => ({
          address: { ...state.address, ...address },
          lastUpdatedAt: new Date().toISOString()
        }));
      },

      setMedicalProfile: (profile: Partial<MedicalProfile>) => {
        set((state) => ({
          medicalProfile: { ...state.medicalProfile, ...profile },
          lastUpdatedAt: new Date().toISOString()
        }));
      },

      setMedicalHistory: (history: Partial<MedicalHistory>) => {
        set((state) => ({
          medicalHistory: { ...state.medicalHistory, ...history },
          lastUpdatedAt: new Date().toISOString()
        }));
      },

      setGLP1Profile: (profile: Partial<GLP1Profile>) => {
        set((state) => ({
          glp1Profile: { ...state.glp1Profile, ...profile },
          lastUpdatedAt: new Date().toISOString()
        }));
      },

      setWeight: (weight: Partial<WeightInfo>) => {
        set((state) => ({
          medicalProfile: {
            ...state.medicalProfile,
            weight: { ...state.medicalProfile.weight, ...weight }
          },
          lastUpdatedAt: new Date().toISOString()
        }));
      },

      // ========== QUALIFICATION ==========
      
      setQualified: (qualified: boolean, reason?: string) => {
        set({
          qualified,
          disqualificationReason: reason,
          lastUpdatedAt: new Date().toISOString()
        });
      },

      // ========== SESSION MANAGEMENT ==========
      
      resetIntake: () => {
        set(createInitialState());
      },

      getIntakeData: () => {
        const state = get();
        return {
          sessionId: state.sessionId,
          currentStep: state.currentStep,
          completedSteps: state.completedSteps,
          startedAt: state.startedAt,
          lastUpdatedAt: state.lastUpdatedAt,
          personalInfo: state.personalInfo,
          address: state.address,
          medicalProfile: state.medicalProfile,
          medicalHistory: state.medicalHistory,
          glp1Profile: state.glp1Profile,
          responses: state.responses,
          qualified: state.qualified,
          disqualificationReason: state.disqualificationReason,
        };
      },

      // ========== COMPUTED VALUES ==========
      
      getBMI: () => {
        const { medicalProfile } = get();
        const weight = medicalProfile.weight;
        
        if (!weight?.currentWeight || !weight?.heightFeet) {
          return null;
        }

        const heightInches = (weight.heightFeet * 12) + (weight.heightInches || 0);
        if (heightInches === 0) return null;

        const bmi = (weight.currentWeight / (heightInches * heightInches)) * 703;
        return Math.round(bmi * 10) / 10;
      },

      getProgress: (totalSteps: number) => {
        const { completedSteps } = get();
        if (totalSteps === 0) return 0;
        return Math.round((completedSteps.length / totalSteps) * 100);
      },

      isStepCompleted: (stepId: string) => {
        const { completedSteps } = get();
        return completedSteps.includes(stepId);
      },
    }),
    {
      name: 'eon-intake-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist essential data, not computed values or actions
      partialize: (state) => ({
        sessionId: state.sessionId,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        startedAt: state.startedAt,
        lastUpdatedAt: state.lastUpdatedAt,
        personalInfo: state.personalInfo,
        address: state.address,
        medicalProfile: state.medicalProfile,
        medicalHistory: state.medicalHistory,
        glp1Profile: state.glp1Profile,
        responses: state.responses,
        qualified: state.qualified,
        disqualificationReason: state.disqualificationReason,
      }),
    }
  )
);

// ============================================================
// SELECTOR HOOKS (for optimized re-renders)
// ============================================================

export const useSessionId = () => useIntakeStore((state) => state.sessionId);
export const useCurrentStep = () => useIntakeStore((state) => state.currentStep);
export const useCompletedSteps = () => useIntakeStore((state) => state.completedSteps);
export const usePersonalInfo = () => useIntakeStore((state) => state.personalInfo);
export const useAddress = () => useIntakeStore((state) => state.address);
export const useMedicalProfile = () => useIntakeStore((state) => state.medicalProfile);
export const useMedicalHistory = () => useIntakeStore((state) => state.medicalHistory);
export const useGLP1Profile = () => useIntakeStore((state) => state.glp1Profile);
export const useResponses = () => useIntakeStore((state) => state.responses);
export const useQualified = () => useIntakeStore((state) => state.qualified);

// Get a specific response value
export const useResponse = (key: string) => 
  useIntakeStore((state) => state.responses[key]);

// Actions (stable references, don't cause re-renders)
export const useIntakeActions = () => useIntakeStore((state) => ({
  setCurrentStep: state.setCurrentStep,
  markStepCompleted: state.markStepCompleted,
  goBack: state.goBack,
  setResponse: state.setResponse,
  setResponses: state.setResponses,
  setPersonalInfo: state.setPersonalInfo,
  setAddress: state.setAddress,
  setMedicalProfile: state.setMedicalProfile,
  setMedicalHistory: state.setMedicalHistory,
  setGLP1Profile: state.setGLP1Profile,
  setWeight: state.setWeight,
  setQualified: state.setQualified,
  resetIntake: state.resetIntake,
  getIntakeData: state.getIntakeData,
}));

