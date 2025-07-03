import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Signup from './pages/Signup';
import Login from './pages/Login';
import './App.css';
import { isAuthenticated, logout } from './utils/auth';
import PrivateRoute from './components/PrivateRoute';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './services/apiService';

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
    <ApolloProvider client={apolloClient}>
      <Router>
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
                {isAuthenticated() ? (
                  <Menu.Item key="logout" style={{ float: 'right' }} onClick={logout}>Logout</Menu.Item>
                ) : (
                  <>
                    <Menu.Item key="login" style={{ float: 'right' }}><a href="/login">Login</a></Menu.Item>
                    <Menu.Item key="signup" style={{ float: 'right' }}><a href="/signup">Sign Up</a></Menu.Item>
                  </>
                )}
              </Menu>
            </Header>
            <Content>
              <Container maxWidth="md" style={{ marginTop: 32 }}>
                <Suspense fallback={<div>Loading...</div>}>
                  <AnimatePresence mode="wait">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Routes>
                        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                        <Route path="/booking" element={<PrivateRoute><Booking /></PrivateRoute>} />
                        <Route path="/driver" element={<PrivateRoute><Driver /></PrivateRoute>} />
                        <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
                        <Route path="/notification" element={<PrivateRoute><Notification /></PrivateRoute>} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                      </Routes>
                    </motion.div>
                  </AnimatePresence>
                </Suspense>
              </Container>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Uber Clone ©2024</Footer>
          </Layout>
        </ErrorBoundary>
      </Router>
    </ApolloProvider>
  );
}

export default App;
