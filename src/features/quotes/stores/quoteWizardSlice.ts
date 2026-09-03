import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Redux Toolkit slice for the quote wizard's local UI state (current step,
// in-progress draft values before submission). This is UI-local to the
// quotes feature — it's still Redux (per the "Redux Toolkit only" stack
// decision) but lives in this feature's own stores/ folder and is wired
// into the root store as its own reducer key, not shared outside
// `features/quotes` except through the feature's index.ts.
interface QuoteWizardState {
  currentStep: number;
  totalSteps: number;
  draft: Record<string, unknown>;
}

const TOTAL_STEPS = 4;

const initialState: QuoteWizardState = {
  currentStep: 0,
  totalSteps: TOTAL_STEPS,
  draft: {},
};

const quoteWizardSlice = createSlice({
  name: 'quoteWizard',
  initialState,
  reducers: {
    nextStep: (state) => {
      state.currentStep = Math.min(state.currentStep + 1, state.totalSteps - 1);
    },
    previousStep: (state) => {
      state.currentStep = Math.max(state.currentStep - 1, 0);
    },
    updateDraft: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.draft = { ...state.draft, ...action.payload };
    },
    resetWizard: (state) => {
      state.currentStep = 0;
      state.draft = {};
    },
  },
});

export const { nextStep, previousStep, updateDraft, resetWizard } = quoteWizardSlice.actions;
export const quoteWizardReducer = quoteWizardSlice.reducer;
