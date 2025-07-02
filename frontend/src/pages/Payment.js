import React from 'react';
import { Typography, Box, Alert } from '@mui/material';
import { Form, Input, Button } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { initiatePaymentThunk, verifyPaymentThunk, refundPaymentThunk, clearPaymentState } from '../store/paymentSlice';

function Payment() {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.payment);
  const token = localStorage.getItem('token');

  const formik = useFormik({
    initialValues: {
      payment_id: '',
      amount: '',
      currency: 'INR',
    },
    validationSchema: Yup.object({
      payment_id: Yup.string().required('Payment ID required'),
      amount: Yup.number().required('Amount required'),
      currency: Yup.string().required('Currency required'),
    }),
    onSubmit: (values) => {
      dispatch(initiatePaymentThunk({ ...values, token }));
    },
  });

  const handleRefund = () => {
    dispatch(refundPaymentThunk({ payment_id: formik.values.payment_id, amount: formik.values.amount, token }));
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Payment</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <form onSubmit={formik.handleSubmit}>
        <Input
          placeholder="Payment ID"
          id="payment_id"
          name="payment_id"
          value={formik.values.payment_id}
          onChange={formik.handleChange}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Amount"
          id="amount"
          name="amount"
          value={formik.values.amount}
          onChange={formik.handleChange}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Currency"
          id="currency"
          name="currency"
          value={formik.values.currency}
          onChange={formik.handleChange}
          style={{ marginBottom: 8 }}
        />
        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }} loading={loading}>Capture Payment</Button>
        <Button type="default" htmlType="button" onClick={handleRefund} loading={loading}>Refund</Button>
      </form>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Payment Status</Typography>
        {/* Payment status will go here */}
      </Box>
    </Box>
  );
}

export default Payment; 