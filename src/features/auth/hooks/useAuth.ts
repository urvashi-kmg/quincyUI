import { useCallback } from 'react';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';

import { login as loginThunk, logout as logoutThunk } from '../stores/authSlice';
import type { Credentials } from '../types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isInitializing, error } = useAppSelector((s) => s.auth);

  const login = useCallback((credentials: Credentials) => dispatch(loginThunk(credentials)), [dispatch]);
  const logout = useCallback(() => dispatch(logoutThunk()), [dispatch]);

  return { user, isAuthenticated, isInitializing, error, login, logout };
}
