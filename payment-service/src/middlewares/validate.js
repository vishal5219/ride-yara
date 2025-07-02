const yup = require('yup');

const initiateSchema = yup.object().shape({
  userId: yup.string().required(),
  bookingId: yup.string().required(),
  amount: yup.number().required(),
  method: yup.string().required(),
});

const verifySchema = yup.object().shape({
  id: yup.string().required(),
  status: yup.string().oneOf(['PENDING', 'COMPLETED', 'FAILED']).required(),
});

exports.validateInitiate = async (req, res, next) => {
  try {
    await initiateSchema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors[0] });
  }
};

exports.validateVerify = async (req, res, next) => {
  try {
    await verifySchema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors[0] });
  }
}; 