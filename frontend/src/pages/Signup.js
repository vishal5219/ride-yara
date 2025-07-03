import React, { useState } from 'react';
import { Button, Form, Input, Select, message } from 'antd';
import { Box, Typography, Paper } from '@mui/material';
import { registerUserGraphQL, loginUserGraphQL } from '../services/apiService';
import Cookies from 'js-cookie';

const { Option } = Select;

const Signup = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await registerUserGraphQL(values);
      // Auto-login after signup
      const { data } = await loginUserGraphQL({ email: values.email, password: values.password });
      Cookies.set('token', data.login.token, { expires: 1 });
      message.success('Signup successful! You are now logged in.');
      window.location.href = '/';
    } catch (err) {
      message.error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" gutterBottom>Sign Up</Typography>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter your name' }]}> <Input /> </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}> <Input /> </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Please enter your phone number' }]}> <Input /> </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}> <Input.Password /> </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please select a role' }]}> <Select placeholder="Select role"> <Option value="customer">Customer</Option> <Option value="captain">Captain</Option> </Select> </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>Sign Up</Button>
          </Form.Item>
        </Form>
        <Typography variant="body2" align="center" mt={2}>Already have an account? <a href="/login">Login</a></Typography>
      </Paper>
    </Box>
  );
};

export default Signup; 