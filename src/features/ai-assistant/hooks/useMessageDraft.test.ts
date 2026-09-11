import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useMessageDraft } from './useMessageDraft';
import { MAX_MESSAGE_LENGTH } from '../constants';

describe('useMessageDraft', () => {
  it('cannot submit an empty or whitespace-only draft', () => {
    const { result } = renderHook(() => useMessageDraft());
    expect(result.current.canSubmit).toBe(false);

    act(() => result.current.setDraft('   '));
    expect(result.current.canSubmit).toBe(false);
  });

  it('can submit a draft with content', () => {
    const { result } = renderHook(() => useMessageDraft());
    act(() => result.current.setDraft('What is the renewal date?'));
    expect(result.current.canSubmit).toBe(true);
  });

  it('reports the remaining budget and blocks submit past the limit', () => {
    const { result } = renderHook(() => useMessageDraft());
    act(() => result.current.setDraft('x'.repeat(MAX_MESSAGE_LENGTH + 5)));

    expect(result.current.remaining).toBe(-5);
    expect(result.current.isOverLimit).toBe(true);
    expect(result.current.canSubmit).toBe(false);
  });

  it('clears the draft', () => {
    const { result } = renderHook(() => useMessageDraft('hello'));
    act(() => result.current.clear());
    expect(result.current.draft).toBe('');
  });
});
