const jwt = require('jsonwebtoken')

function checkToken(request, response, next) {
  authHeader = request.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return response.status(401).json({ msg: 'Acesso negado.' })
  }

  try {
    const secret = process.env.SECRET
    jwt.verify(token, secret)
    next()
  } catch (err) {
    res.status(400).json({ msg: 'Token invalido' })
  }
}

module.exports = checkToken
