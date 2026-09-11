import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/redux/store';
import type { AsyncStatus } from '@/types';
import {
  fetchNotifications,
  markNotificationRead,
  type AppNotification,
} from '../services/notificationsService';

interface NotificationsState {
  items: AppNotification[];
  status: AsyncStatus;
  error: string | null;
}

const initialState: NotificationsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const loadNotifications = createAsyncThunk('notifications/load', async () =>
  fetchNotifications(),
);

export const markRead = createAsyncThunk('notifications/markRead', async (id: string) => {
  await markNotificationRead(id);
  return id;
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadNotifications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load notifications';
      })
      .addCase(markRead.fulfilled, (state, action) => {
        const target = state.items.find((item) => item.id === action.payload);
        if (target) {
          target.readAt = new Date().toISOString();
        }
      });
  },
});

export default notificationsSlice.reducer;

// Selectors live with the slice that owns the state.
const selectNotificationsState = (state: RootState) => state.notifications;

export const selectNotifications = createSelector(
  selectNotificationsState,
  (slice) => slice.items,
);

export const selectUnreadCount = createSelector(selectNotifications, (items) =>
  items.reduce((count, item) => (item.readAt === null ? count + 1 : count), 0),
);
