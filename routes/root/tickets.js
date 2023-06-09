const { Router } = require('express')
const Ticket = require('../../models/Ticket')

const router = Router()

// Rota GET para obter todos os tickets
router.get('/', async (request, response) => {
  const owner_id = request.query.owner_id

  try {
    //Se tiver um owner_id definido, entao encontre os tickets com ESSE owner_id. Se NÃO encontre TODOS
    const tickets = owner_id ? await Ticket.find({ owner_id }) : await Ticket.find()
    return response.status(200).json(tickets)
  } catch (err) {
    console.error(err)
    return response.status(500).json({ msg: 'Error retrieving tickets' })
  }
})

// Rota GET para obter um ticket específico
router.get('/:id', async (request, response) => {
  const { id } = request.params

  try {
    //Encontrar um ticket no banco de dados com o _id (id banco de dados) = id (id da url)
    const ticket = await Ticket.findById(id)

    //  envia msg dde erro caso nenhum ticket com o id especificado seja encontrado
    if (!ticket) {
      return response.status(404).json({ msg: 'Ticket not found' })
    }
    return response.status(200).json(ticket)
  } catch (err) {
    console.error(err)
    return response.status(500).json({ msg: 'Error retrieving ticket' })
  }
})

router.post('/', async (request, response) => {
  // Estou querendo apenas esses 3 campos do objeto request.body
  const { owner_id, nome, valor } = request.body

  // Se algum dos campos estiver auxente, ele acusa um erro
  if (!owner_id || !nome || !valor) {
    return response.status(422).json({ msg: 'All fields must be filled' })
  }

  //Cria um objeto do modelo Ticket
  try {
    const ticket = new Ticket({
      owner_id,
      nome,
      valor,
      data_da_compra: Date.now(),
    })

    await ticket.save()

    return response.sendStatus(201)
  } catch (err) {
    console.error(err)
    response.status(500).json({ msg: 'Error creating ticket' })
  }
})

// Rota PUT para atualizar um ticket
router.put('/:id', async (request, response) => {
  const { id } = request.params
  // Estou querendo apenas esses 3 campos do objeto request.body
  const { owner_id, nome, valor } = request.body

  try {
    const ticket = await Ticket.findById(id)
    //  envia msg dde erro caso nenhum ticket com o id especificado seja encontrado
    if (!ticket) {
      return response.status(404).json({ msg: 'Ticket not found' })
    }

    ticket.owner_id = owner_id
    ticket.nome = nome
    ticket.valor = valor

    await ticket.save()

    return response.sendStatus(200)
  } catch (err) {
    console.error(err)
    return response.status(500).json({ msg: 'Error updating ticket' })
  }
})

// Rota DELETE para excluir um ticket
router.delete('/:id', async (request, response) => {
  const { id } = request.params

  try {
    const ticket = await Ticket.findById(id)
    if (!ticket) {
      return response.status(404).json({ msg: 'Ticket not found' })
    }

    await ticket.deleteOne()

    return response.sendStatus(200)
  } catch (err) {
    console.error(err)
    return response.status(500).json({ msg: 'Error deleting ticket' })
  }
})

module.exports = router
