import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerDriver, loginDriver } from '../services/apiService';

export const registerDriverThunk = createAsyncThunk('driver/register', async (data, { rejectWithValue }) => {
  try {
    const res = await registerDriver(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const loginDriverThunk = createAsyncThunk('driver/login', async (data, { rejectWithValue }) => {
  try {
    const res = await loginDriver(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

const driverSlice = createSlice({
  name: 'driver',
  initialState: {
    driver: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearDriverState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerDriverThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(registerDriverThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.driver = action.payload;
        state.success = 'Registration successful';
      })
      .addCase(registerDriverThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginDriverThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(loginDriverThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.driver = action.payload;
        state.success = 'Login successful';
      })
      .addCase(loginDriverThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDriverState } = driverSlice.actions;
export default driverSlice.reducer; 