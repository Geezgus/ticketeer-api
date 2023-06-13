const bcrypt = require('bcrypt')
const { Router } = require('express')

const User = require('../../models/User')
const checkToken = require('../../middlewares/checkToken')

const router = Router()

router.get('/', checkToken, async (request, response) => {
  const users = await User.find({}, '-password_hash')

  if (!users) {
    return response.sendStatus(404)
  }

  return response.status(200).json(users)
})

router.get('/:id', checkToken, async (request, response) => {
  const { id } = request.params

  const user = await User.findById(id, '-password_hash')

  if (!user) {
    return response.sendStatus(404)
  }

  return response.status(200).json(user)
})

router.put('/:id', async (request, response) => {
  const { id } = request.params
  const { name, email, password, password_confirm } = request.body

  const allFieldsFilled = name && email && password && password_confirm
  const passwordsMatch = password === password_confirm
  const user = await User.findById(id)

  if (!user) {
    return response.sendStatus(404).json({ msg: 'User does not exist' })
  }

  if (!allFieldsFilled) {
    return response.sendStatus(422).json({ msg: 'All fields must be filled' })
  }

  if (!passwordsMatch) {
    return response.sendStatus(422).json({ msg: "Passwords don't match" })
  }

  const salt = await bcrypt.genSalt()
  const password_hash = await bcrypt.hash(password, salt)

  try {
    user.name = name
    user.email = email
    user.password_hash = password_hash
    user.save()

    return response.sendStatus(201)
  } catch (err) {
    console.error(err)
    res.status(500)
  }
})

router.patch('/:id', async (request, response) => {
  const { id } = request.params
  const { name, email, password, password_confirm } = request.body

  const passwordsMatch = password === password_confirm
  const user = await User.findById(id)
  const passwords = password && password_confirm

  if (!user) {
    return response.sendStatus(404).json({ msg: 'User does not exist' })
  }

  if (passwords && !passwordsMatch) {
    return response.sendStatus(422).json({ msg: "Passwords don't match" })
  }

  if (name) {
    user.name = name
  }

  if (email) {
    user.email = email
  }

  if (passwords && passwordsMatch) {
    const salt = await bcrypt.genSalt()
    const password_hash = await bcrypt.hash(password, salt)
    user.password_hash = password_hash
  }

  try {
    user.save()
    return response.sendStatus(201)
  } catch (err) {
    console.error(err)
    res.status(500)
  }
})

router.delete('/:id', async (request, response) => {
  const { id } = request.params
  const user = await User.findById(id)

  if (!user) {
    return response.sendStatus(404).json({ msg: 'User does not exist' })
  }

  try {
    user.deleteOne()

    return response.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.status(500)
  }
})

module.exports = router
