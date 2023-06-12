const mongoose = require('mongoose')

/**
 * @param {string} uri
 * @param {mongoose.ConnectOptions | undefined} options
 */

async function connect(uri, options) {
  try {
    await mongoose.connect(uri, options)
  } catch (err) {
    console.error(err)
  }
}

module.exports = connect
