const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Router } = require('express')

const User = require('../../../models/User')

const router = Router()

router.post('/', async (request, response) => {
  const { email, password } = request.body

  const user = await User.findOne({ email })

  const allFieldsFilled = email && password
  if (!allFieldsFilled) {
    return response.sendStatus(422).json({ msg: 'All fields must be filled' })
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password_hash)
  if (!isPasswordCorrect) {
    return response.sendStatus(422).json({ msg: 'Password is incorrect' })
  }

  try {
    const secret = process.env.SECRET

    const token = jwt.sign(
      {
        id: user._id,
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
