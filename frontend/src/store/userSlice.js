import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, loginUser } from '../services/apiService';

export const registerUserThunk = createAsyncThunk('user/register', async (data, { rejectWithValue }) => {
  try {
    const res = await registerUser(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const loginUserThunk = createAsyncThunk('user/login', async (data, { rejectWithValue }) => {
  try {
    const res = await loginUser(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearUserState: (state) => {
      state.error = null;
      state.success = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = 'Registration successful';
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = 'Login successful';
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserState, setUser } = userSlice.actions;
export default userSlice.reducer; 