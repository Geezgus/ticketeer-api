const bcrypt = require('bcrypt')
const { Router } = require('express')

const User = require('../../../models/User')

const router = Router()

router.post('/', async (request, response) => {
  const { name, email, password, password_confirm } = request.body

  const allFieldsFilled = name && email && password && password_confirm
  const passwordsMatch = password === password_confirm

  if (!allFieldsFilled) {
    return response.status(422).json({ msg: 'All fields must be filled', code: 200 })
  }

  if (!passwordsMatch) {
    return response.status(422).json({ msg: "Passwords don't match", code: 201 })
  }

  if (await User.exists({ email })) {
    return response.status(422).json({ msg: "There's already a user with this email", code: 202 })
  }

  const salt = await bcrypt.genSalt()
  const password_hash = await bcrypt.hash(password, salt)

  const user = new User({ name, email, password_hash })

  try {
    user.save()
    return response.sendStatus(201)
  } catch (err) {
    console.error(err)
    res.status(500)
  }
})

module.exports = router
