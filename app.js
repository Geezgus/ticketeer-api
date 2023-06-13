require('dotenv').config()
const express = require('express')
const cors = require('cors')

const connect = require('./database/connect')

const app = express()
const port = process.env.PORT || 3333

// Configure JSON response
app.use(express.json())

// Configure CORS
app.use(cors())

// Configure URL encoded
app.use(express.urlencoded({ extended: true }))

// Use routers
app.use('/', require('./routes/root'))
app.use('/auth/login', require('./routes/root/auth/login'))
app.use('/auth/register', require('./routes/root/auth/register'))
app.use('/users', require('./routes/root/users'))

// Connect to database
connect(process.env.DB_CONN_STR).then(() => console.log('Database connection established'))

// Start listening
app.listen(port, () => {
  console.log('Server listening on port', port)
})
