const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Router } = require('express')

const User = require('../../../models/User')

const router = Router()

router.post('/', async (request, response) => {
  const { email, password } = request.body

  const allFieldsFilled = email && password
  if (!allFieldsFilled) {
    return response.status(422).json({ msg: 'All fields must be filled', code: 100 })
  }

  const user = await User.findOne({ email })

  if (!user) {
    return response.status(404).json({ msg: 'No user with found using this email.', code: 101 })
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password_hash)
  if (!isPasswordCorrect) {
    return response.status(422).json({ msg: 'Password is incorrect', code: 102 })
  }

  try {
    const secret = process.env.SECRET

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
      },
      secret
    )

    console.log(`User ${user.name} just logged in`)
    return response.status(200).json({ token })
  } catch (err) {
    console.error(err)
    return response.sendStatus(500)
  }
})

module.exports = router
