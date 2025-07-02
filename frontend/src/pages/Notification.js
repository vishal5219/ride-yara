import React, { useEffect } from 'react';
import { Typography, Box, Alert } from '@mui/material';
import { List, message as antdMessage } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotificationsThunk, markNotificationReadThunk, addNotification, clearNotificationState } from '../store/notificationSlice';
import useSocket from '../hooks/useSocket';

function Notification() {
  const dispatch = useDispatch();
  const { notifications, loading, error, success } = useSelector((state) => state.notification);
  const token = localStorage.getItem('token');

  useSocket(
    () => {
      // Listen for real-time notifications
      window.socket?.on('notification', (msg) => {
        dispatch(addNotification(msg));
        antdMessage.info('New notification received!');
      });
    },
    () => {
      window.socket?.off('notification');
    }
  );

  useEffect(() => {
    dispatch(fetchNotificationsThunk(token));
    return () => {
      dispatch(clearNotificationState());
    };
  }, [dispatch, token]);

  const handleMarkRead = (id) => {
    dispatch(markNotificationReadThunk({ id, token }));
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Notifications</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <List
        bordered
        dataSource={notifications}
        renderItem={item => (
          <List.Item actions={[<a key="mark" onClick={() => handleMarkRead(item.id)}>Mark as read</a>]}> {item.message || item} </List.Item>
        )}
        style={{ marginTop: 16 }}
        loading={loading}
      />
    </Box>
  );
}

export default Notification; 