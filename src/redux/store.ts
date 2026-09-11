import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/auth/stores/authSlice';
import dashboardReducer from '@/features/dashboard/stores/dashboardSlice';
import notificationsReducer from '@/features/notifications/stores/notificationsSlice';
import quotesReducer from '@/features/quotes/stores/quotesSlice';

/**
 * Root store. Redux Toolkit is the single state mechanism for server state,
 * client state, and complex state — see CLAUDE.md. Register each feature's
 * reducer here; the slice itself lives in src/features/<name>/stores.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    notifications: notificationsReducer,
    quotes: quotesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
