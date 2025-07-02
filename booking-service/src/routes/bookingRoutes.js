const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
// const auth = require('../middlewares/auth'); // To be implemented

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
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
 *               origin:
 *                 type: string
 *               destination:
 *                 type: string
 *           example:
 *             userId: "user-uuid"
 *             origin: "A Street"
 *             destination: "B Avenue"
 *     responses:
 *       201:
 *         description: Booking created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

router.post('/', auth, validate.validateBooking, bookingController.createBooking);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized
 */

router.get('/', auth, bookingController.listBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get a booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Booking not found
 *       401:
 *         description: Unauthorized
 */

router.get('/:id', auth, bookingController.getBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [REQUESTED, ACCEPTED, COMPLETED, CANCELLED]
 *               driverId:
 *                 type: string
 *               fare:
 *                 type: number
 *           example:
 *             status: "ACCEPTED"
 *             driverId: "driver-uuid"
 *             fare: 100.5
 *     responses:
 *       200:
 *         description: Booking updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */

router.put('/:id', auth, validate.validateUpdate, bookingController.updateBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */

router.delete('/:id', auth, bookingController.cancelBooking);

/**
 * @swagger
 * /api/bookings/{id}/assign-driver:
 *   post:
 *     summary: Assign a driver to a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Driver assigned
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */

router.post('/:id/assign-driver', auth, bookingController.assignDriver);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   get:
 *     summary: Get the status of a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */

router.get('/:id/status', auth, bookingController.getBookingStatus);

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         driverId:
 *           type: string
 *         origin:
 *           type: string
 *         destination:
 *           type: string
 *         status:
 *           type: string
 *         fare:
 *           type: number
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */

module.exports = router; 