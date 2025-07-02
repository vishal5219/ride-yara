import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getNotifications, markNotificationRead } from '../services/apiService';

export const fetchNotificationsThunk = createAsyncThunk('notification/fetch', async (token, { rejectWithValue }) => {
  try {
    const res = await getNotifications(token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch notifications');
  }
});

export const markNotificationReadThunk = createAsyncThunk('notification/markRead', async ({ id, token }, { rejectWithValue }) => {
  try {
    const res = await markNotificationRead(id, token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to mark as read');
  }
});

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearNotificationState: (state) => {
      state.error = null;
      state.success = null;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.success = 'Notifications loaded';
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationReadThunk.fulfilled, (state, action) => {
        state.success = 'Notification marked as read';
      });
  },
});

export const { clearNotificationState, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer; 