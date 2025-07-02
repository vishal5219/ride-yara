// Driver Controller for Uber-like app
const prisma = require('../models');
const bcrypt = require('bcryptjs');
const DriverService = require('../services/driverService');

exports.registerDriver = async (req, res) => {
  try {
    const { name, email, phone, password, vehicleNumber } = req.body;
    const existing = await prisma.driver.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const driver = await prisma.driver.create({
      data: { name, email, phone, password: hashed, vehicleNumber, status: 'available' },
    });
    res.status(201).json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDrivers = async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDriverById = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await prisma.driver.findUnique({ where: { id } });
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDriverStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const driver = await prisma.driver.update({
      where: { id },
      data: { status },
    });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  // TODO: Implement driver registration
  res.json({ message: 'Driver registered' });
};

exports.login = async (req, res) => {
  // TODO: Implement driver login
  res.json({ message: 'Driver logged in' });
};

exports.updateStatus = async (req, res) => {
  // TODO: Implement status update
  res.json({ message: 'Status updated' });
};

exports.acceptRide = async (req, res) => {
  // TODO: Implement ride acceptance
  res.json({ message: 'Ride accepted' });
};

exports.rejectRide = async (req, res) => {
  // TODO: Implement ride rejection
  res.json({ message: 'Ride rejected' });
};

exports.getProfile = async (req, res) => {
  // TODO: Implement get driver profile
  res.json({ message: 'Driver profile' });
};

exports.getHistory = async (req, res) => {
  // TODO: Implement get driver history
  res.json({ message: 'Driver history' });
};

exports.getRatings = async (req, res) => {
  // TODO: Implement get driver ratings
  res.json({ message: 'Driver ratings' });
}; 