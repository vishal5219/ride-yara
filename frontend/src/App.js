import React, { useEffect, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Container } from '@mui/material';
import { Layout, Menu, Alert } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Driver from './pages/Driver';
import Payment from './pages/Payment';
import Notification from './pages/Notification';
import './App.css';

const { Header, Content, Footer } = Layout;

const socket = io(process.env.REACT_APP_API_GATEWAY_URL.replace('http', 'ws'));

function App() {
  useEffect(() => {
    socket.on('connect', () => {
      // Subscribe to user/driver/notification events as needed
    });
    return () => socket.disconnect();
  }, []);

  return (
    <ErrorBoundary fallback={<Alert message="Something went wrong" type="error" showIcon />}>
      <Helmet>
        <title>Uber Clone</title>
        <meta name="description" content="Uber-like app with microservices architecture" />
      </Helmet>
      <Layout style={{ minHeight: '100vh' }}>
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']}>
            <Menu.Item key="home"><a href="/">Home</a></Menu.Item>
            <Menu.Item key="booking"><a href="/booking">Booking</a></Menu.Item>
            <Menu.Item key="driver"><a href="/driver">Driver</a></Menu.Item>
            <Menu.Item key="payment"><a href="/payment">Payment</a></Menu.Item>
            <Menu.Item key="notification"><a href="/notification">Notification</a></Menu.Item>
          </Menu>
        </Header>
        <Content>
          <Container maxWidth="md" style={{ marginTop: 32 }}>
            <Suspense fallback={<div>Loading...</div>}>
              <AnimatePresence mode="wait">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/driver" element={<Driver />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/notification" element={<Notification />} />
                  </Routes>
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </Container>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Uber Clone ©2024</Footer>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
