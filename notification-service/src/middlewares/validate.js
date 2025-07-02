const yup = require('yup');

const notificationSchema = yup.object().shape({
  userId: yup.string().required(),
  message: yup.string().required(),
  type: yup.string().oneOf(['email', 'sms', 'push']).required(),
});

exports.validateNotification = async (req, res, next) => {
  try {
    await notificationSchema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors[0] });
  }
}; 