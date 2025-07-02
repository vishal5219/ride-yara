import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createBooking, listBookings } from '../services/apiService';

export const createBookingThunk = createAsyncThunk('booking/create', async ({ data, token }, { rejectWithValue }) => {
  try {
    const res = await createBooking(data, token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Booking failed');
  }
});

export const listBookingsThunk = createAsyncThunk('booking/list', async (token, { rejectWithValue }) => {
  try {
    const res = await listBookings(token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch bookings');
  }
});

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookings: [],
    loading: false,
    error: null,
    success: null,
    driverLocation: null,
    customerLocation: null,
  },
  reducers: {
    clearBookingState: (state) => {
      state.error = null;
      state.success = null;
    },
    setDriverLocation: (state, action) => {
      state.driverLocation = action.payload;
    },
    setCustomerLocation: (state, action) => {
      state.customerLocation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createBookingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Booking created';
      })
      .addCase(createBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(listBookingsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listBookingsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(listBookingsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingState, setDriverLocation, setCustomerLocation } = bookingSlice.actions;
export default bookingSlice.reducer; 