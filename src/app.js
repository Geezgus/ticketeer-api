import dotenv from 'dotenv'
dotenv.config()

import express, { json } from 'express'

const app = express()
app.use(json())

import('./routes/root.js').then((route) => {
  app.use('/', route.router)
})

import('./routes/eventos.js').then((route) => {
  app.use('/eventos', route.router)
})

const port = process.env.PORT || 3333

app.listen(port, () => {
  console.log('server listening on port', port)
})
