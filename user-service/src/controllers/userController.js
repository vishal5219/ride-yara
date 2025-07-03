const UserService = require('../services/userService');

exports.register = async (req, res) => {
  try {
    const user = await UserService.register(req.body);
    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { user, token } = await UserService.login(req.body);
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  // TODO: Implement get user profile
  res.json({ message: 'User profile' });
};

exports.updateProfile = async (req, res) => {
  // TODO: Implement update user profile
  res.json({ message: 'Profile updated' });
};

exports.getHistory = async (req, res) => {
  // TODO: Implement get user ride history
  res.json({ message: 'User history' });
};

exports.getRatings = async (req, res) => {
  // TODO: Implement get user ratings
  res.json({ message: 'User ratings' });
}; 