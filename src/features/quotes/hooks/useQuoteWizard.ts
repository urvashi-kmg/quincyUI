import { useCallback } from 'react';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';

import { nextStep, previousStep, resetWizard, updateDraft } from '../stores/quoteWizardSlice';

export function useQuoteWizard() {
  const dispatch = useAppDispatch();
  const { currentStep, totalSteps, draft } = useAppSelector((s) => s.quoteWizard);

  return {
    currentStep,
    totalSteps,
    draft,
    goNext: useCallback(() => dispatch(nextStep()), [dispatch]),
    goPrevious: useCallback(() => dispatch(previousStep()), [dispatch]),
    updateDraft: useCallback((values: Record<string, unknown>) => dispatch(updateDraft(values)), [dispatch]),
    reset: useCallback(() => dispatch(resetWizard()), [dispatch]),
  };
}
