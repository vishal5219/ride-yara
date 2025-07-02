const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
// const auth = require('../middlewares/auth'); // To be implemented

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management
 */

/**
 * @swagger
 * /api/payments/initiate:
 *   post:
 *     summary: Initiate a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               bookingId:
 *                 type: string
 *               amount:
 *                 type: number
 *               method:
 *                 type: string
 *           example:
 *             userId: "user-uuid"
 *             bookingId: "booking-uuid"
 *             amount: 150.75
 *             method: "card"
 *     responses:
 *       201:
 *         description: Payment initiated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *
 * /api/payments/verify:
 *   post:
 *     summary: Verify a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, COMPLETED, FAILED]
 *           example:
 *             id: "payment-uuid"
 *             status: "COMPLETED"
 *     responses:
 *       200:
 *         description: Payment verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 *
 * /api/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       401:
 *         description: Unauthorized
 *
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         bookingId:
 *           type: string
 *         amount:
 *           type: number
 *         method:
 *           type: string
 *         status:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */

router.post('/initiate', auth, validate.validateInitiate, paymentController.initiatePayment);
router.post('/verify', auth, validate.validateVerify, paymentController.verifyPayment);
router.post('/refund', auth, paymentController.refundPayment);
router.get('/history', auth, paymentController.getPaymentHistory);
router.post('/webhook', paymentController.webhook);

module.exports = router; 