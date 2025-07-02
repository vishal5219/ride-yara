const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
// const auth = require('../middlewares/auth'); // To be implemented

/**
 * @swagger
 * tags:
 *   name: Drivers
 *   description: Driver management
 */

/**
 * @swagger
 * /api/drivers/register:
 *   post:
 *     summary: Register a new driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               vehicleNumber:
 *                 type: string
 *           example:
 *             name: "John Doe"
 *             email: "john@example.com"
 *             phone: "1234567890"
 *             password: "password123"
 *             vehicleNumber: "AB123CD"
 *     responses:
 *       201:
 *         description: Driver registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       400:
 *         description: Validation error
 *
 * /api/drivers:
 *   get:
 *     summary: Get all drivers
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of drivers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Driver'
 *       401:
 *         description: Unauthorized
 *
 * /api/drivers/{id}:
 *   get:
 *     summary: Get a driver by ID
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Driver ID
 *     responses:
 *       200:
 *         description: Driver found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       404:
 *         description: Driver not found
 *       401:
 *         description: Unauthorized
 *
 * /api/drivers/{id}/status:
 *   put:
 *     summary: Update driver status
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Driver ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [available, busy, offline]
 *           example:
 *             status: "busy"
 *     responses:
 *       200:
 *         description: Driver status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Driver not found
 *
 * components:
 *   schemas:
 *     Driver:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         vehicleNumber:
 *           type: string
 *         status:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */

router.post('/register', validate.validateRegister, driverController.register);
router.post('/login', driverController.login);
router.put('/status', auth, validate.validateStatus, driverController.updateStatus);
router.post('/accept-ride', auth, driverController.acceptRide);
router.post('/reject-ride', auth, driverController.rejectRide);
router.get('/profile', auth, driverController.getProfile);
router.get('/history', auth, driverController.getHistory);
router.get('/ratings', auth, driverController.getRatings);

module.exports = router; 