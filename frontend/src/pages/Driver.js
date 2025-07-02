import React, { useEffect } from 'react';
import { Typography, Box, Alert } from '@mui/material';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { registerDriverThunk, loginDriverThunk, clearDriverState } from '../store/driverSlice';
import useSocket from '../hooks/useSocket';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { setCustomerLocation } from '../store/bookingSlice';

function Driver() {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.driver);
  const { customerLocation } = useSelector((state) => state.booking);

  useSocket(
    () => {
      window.socket?.on('customerLocation', (location) => {
        dispatch(setCustomerLocation(location));
      });
    },
    () => {
      window.socket?.off('customerLocation');
    }
  );

  useEffect(() => {
    return () => {
      dispatch(clearDriverState());
    };
  }, [dispatch]);

  // Example: send driver location to backend (simulate with static location)
  useEffect(() => {
    if (window.socket) {
      window.socket.emit('locationUpdate', { role: 'driver', lat: 28.7041, lng: 77.1025 });
    }
  }, []);

  const onFinish = (values) => {
    // For demo, treat as registration if name is present, else login
    if (values.name) {
      dispatch(registerDriverThunk(values));
    } else {
      dispatch(loginDriverThunk(values));
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Driver Dashboard</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 400 }}>
        <Form.Item label="Name" name="name"><Input /></Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}> <Input /> </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}> <Input.Password /> </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>Register/Login</Button>
        </Form.Item>
      </Form>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Customer Live Location</Typography>
        <Box sx={{ height: 300 }}>
          <MapContainer center={[28.7041, 77.1025]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {customerLocation && (
              <Marker position={[customerLocation.lat, customerLocation.lng]}>
                <Popup>Customer Location</Popup>
              </Marker>
            )}
          </MapContainer>
        </Box>
      </Box>
    </Box>
  );
}

export default Driver; 