import React, { Suspense, useEffect } from 'react';
import { Typography, Box, Button, TextField, Alert } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createBookingThunk, listBookingsThunk, clearBookingState, setDriverLocation } from '../store/bookingSlice';
import useSocket from '../hooks/useSocket';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LazyBookingList = React.lazy(() => import('../components/BookingListPlaceholder'));

function Booking() {
  const dispatch = useDispatch();
  const { bookings, loading, error, success, driverLocation } = useSelector((state) => state.booking);
  const token = localStorage.getItem('token');

  useSocket(
    () => {
      window.socket?.on('driverLocation', (location) => {
        dispatch(setDriverLocation(location));
      });
    },
    () => {
      window.socket?.off('driverLocation');
    }
  );

  const formik = useFormik({
    initialValues: {
      pickup: '',
      dropoff: '',
    },
    validationSchema: Yup.object({
      pickup: Yup.string().required('Pickup location required'),
      dropoff: Yup.string().required('Dropoff location required'),
    }),
    onSubmit: (values, { resetForm }) => {
      dispatch(createBookingThunk({ data: values, token }));
      resetForm();
    },
  });

  useEffect(() => {
    dispatch(listBookingsThunk(token));
    return () => {
      dispatch(clearBookingState());
    };
  }, [dispatch, token]);

  // Example: send customer location to backend (simulate with static location)
  useEffect(() => {
    if (window.socket) {
      window.socket.emit('locationUpdate', { role: 'customer', lat: 28.6139, lng: 77.2090 });
    }
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Book a Ride</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          id="pickup"
          name="pickup"
          label="Pickup Location"
          value={formik.values.pickup}
          onChange={formik.handleChange}
          error={formik.touched.pickup && Boolean(formik.errors.pickup)}
          helperText={formik.touched.pickup && formik.errors.pickup}
        />
        <TextField
          fullWidth
          margin="normal"
          id="dropoff"
          name="dropoff"
          label="Dropoff Location"
          value={formik.values.dropoff}
          onChange={formik.handleChange}
          error={formik.touched.dropoff && Boolean(formik.errors.dropoff)}
          helperText={formik.touched.dropoff && formik.errors.dropoff}
        />
        <Button color="primary" variant="contained" fullWidth type="submit" sx={{ mt: 2 }} disabled={loading}>
          {loading ? 'Booking...' : 'Book Now'}
        </Button>
      </form>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Driver Live Location</Typography>
        <Box sx={{ height: 300 }}>
          <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {driverLocation && (
              <Marker position={[driverLocation.lat, driverLocation.lng]}>
                <Popup>Driver Location</Popup>
              </Marker>
            )}
          </MapContainer>
        </Box>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Your Bookings</Typography>
        <Suspense fallback={<div>Loading bookings...</div>}>
          <LazyBookingList bookings={bookings} loading={loading} />
        </Suspense>
      </Box>
    </Box>
  );
}

export default Booking; 