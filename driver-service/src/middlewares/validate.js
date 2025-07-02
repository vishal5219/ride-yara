const yup = require('yup');

const registerSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
  password: yup.string().required(),
  vehicleNumber: yup.string().required(),
});

const statusSchema = yup.object().shape({
  status: yup.string().oneOf(['available', 'busy', 'offline']).required(),
});

exports.validateRegister = async (req, res, next) => {
  try {
    await registerSchema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors[0] });
  }
};

exports.validateStatus = async (req, res, next) => {
  try {
    await statusSchema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors[0] });
  }
}; 