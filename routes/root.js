const { Router } = require('express')

const router = Router()

router.get('/', async (request, response, next) => {
  response.status(200).send('Bem vindo!')
})

module.exports = router
