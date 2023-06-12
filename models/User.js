const mongoose = require('mongoose')

const User = mongoose.model('User', {
  name: String,
  email: String,
  password_hash: String,
})

module.exports = User
