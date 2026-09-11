import { useCallback, useState } from 'react';
import { MAX_MESSAGE_LENGTH } from '../constants';

interface UseMessageDraftResult {
  draft: string;
  setDraft: (value: string) => void;
  remaining: number;
  isOverLimit: boolean;
  canSubmit: boolean;
  clear: () => void;
}

/** Draft state + length budget for the assistant composer. */
export function useMessageDraft(initial = ''): UseMessageDraftResult {
  const [draft, setDraft] = useState(initial);

  const trimmedLength = draft.trim().length;
  const remaining = MAX_MESSAGE_LENGTH - draft.length;

  return {
    draft,
    setDraft,
    remaining,
    isOverLimit: remaining < 0,
    canSubmit: trimmedLength > 0 && remaining >= 0,
    clear: useCallback(() => setDraft(''), []),
  };
}
