import { configureStore } from '@reduxjs/toolkit';
import driverReducer from './driverSlice';
import paymentReducer from './paymentSlice';
import notificationReducer from './notificationSlice';
import bookingReducer from './bookingSlice';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    driver: driverReducer,
    payment: paymentReducer,
    notification: notificationReducer,
    booking: bookingReducer,
    user: userReducer,
  },
});

export default store; 