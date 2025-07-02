import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { initiatePayment, verifyPayment, refundPayment } from '../services/apiService';

export const initiatePaymentThunk = createAsyncThunk('payment/initiate', async (data, { rejectWithValue }) => {
  try {
    const res = await initiatePayment(data, data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Payment initiation failed');
  }
});

export const verifyPaymentThunk = createAsyncThunk('payment/verify', async (data, { rejectWithValue }) => {
  try {
    const res = await verifyPayment(data, data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Payment verification failed');
  }
});

export const refundPaymentThunk = createAsyncThunk('payment/refund', async (data, { rejectWithValue }) => {
  try {
    const res = await refundPayment(data, data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Refund failed');
  }
});

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    payment: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearPaymentState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePaymentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(initiatePaymentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload;
        state.success = 'Payment initiated';
      })
      .addCase(initiatePaymentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyPaymentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(verifyPaymentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload;
        state.success = 'Payment verified';
      })
      .addCase(verifyPaymentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(refundPaymentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(refundPaymentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload;
        state.success = 'Refund successful';
      })
      .addCase(refundPaymentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer; 