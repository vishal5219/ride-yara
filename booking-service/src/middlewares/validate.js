const yup = require('yup');

const bookingSchema = yup.object().shape({
  userId: yup.string().required(),
  origin: yup.string().required(),
  destination: yup.string().required(),
});

const updateSchema = yup.object().shape({
  status: yup.string().oneOf(['REQUESTED', 'ACCEPTED', 'COMPLETED', 'CANCELLED']),
  driverId: yup.string(),
  fare: yup.number(),
});

exports.validateBooking = async (req, res, next) => {
  try {
    await bookingSchema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors[0] });
  }
};

exports.validateUpdate = async (req, res, next) => {
  try {
    await updateSchema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors[0] });
  }
}; 