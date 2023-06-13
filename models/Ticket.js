const mongoose = require('mongoose')

const Ticket = mongoose.model('Ticket', {
  owner_id: String,
  nome: String,
  data_da_compra: Date,
  valor: Number,
})

module.exports = Ticket
