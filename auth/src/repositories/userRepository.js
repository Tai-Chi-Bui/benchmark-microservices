const User = require("../models/user");

class UserRepository {
  async getUserById(userId) {
    return await User.findById(userId);
  }

  async getUserByUsername(username) {
    return await User.findOne({ username });
  }

  async createUser(user) {
    return await User.create(user);
  }
}

module.exports = UserRepository;
