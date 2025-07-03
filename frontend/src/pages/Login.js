import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { Box, Typography, Paper } from '@mui/material';
import { loginUserGraphQL } from '../services/apiService';
import Cookies from 'js-cookie';

const Login = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { data } = await loginUserGraphQL(values);
      Cookies.set('token', data.login.token, { expires: 1 });
      message.success('Login successful!');
      window.location.href = '/';
    } catch (err) {
      message.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please enter your email' }]}> <Input /> </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter your password' }]}> <Input.Password /> </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>Login</Button>
          </Form.Item>
        </Form>
        <Typography variant="body2" align="center" mt={2}>Don't have an account? <a href="/signup">Sign Up</a></Typography>
      </Paper>
    </Box>
  );
};

export default Login; 