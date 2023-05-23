import { ObjectId } from 'mongodb'

import { Router } from 'express'
import client from '../dbclient.js'

const router = Router()

export default router
export { router }

function getCollection() {
  return client.db(process.env.DATABASE).collection(process.env.COLLECTION_EVENTOS)
}

router.get('/', async (_, res) => {
  try {
    const collection = getCollection()
    const eventos = await collection.find({}).toArray()
    return res.status(200).send(eventos)
  } catch (err) {
    console.error(err)
    return res.status(404).send([])
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const collection = getCollection()
    const evento = await collection.findOne({ _id: new ObjectId(id) })

    if (!evento) {
      return res.sendStatus(404)
    }

    return res.status(200).send(evento)
  } catch (err) {
    console.error(err)
    return res.statusStatus(400)
  }
})

router.post('/', async (req, res) => {
  try {
    const { data, ...resto } = req.body
    const collection = getCollection()
    await collection.insertOne({ data: new Date(data), ...resto })
    return res.sendStatus(201)
  } catch (err) {
    console.error(err)
    return res.sendStatus(400)
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { data, ...resto } = req.body

  try {
    const collection = getCollection()
    const evento = await collection.findOneAndReplace({ _id: new ObjectId(id) }, { data: new Date(data), ...resto })

    if (!evento) {
      return res.sendStatus(404)
    }

    return res.sendStatus(204)
  } catch (err) {
    console.error(err)
    return res.sendStatus(400)
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const { data, ...resto } = req.body

  try {
    const collection = getCollection()
    const evento = await collection.findOneAndDelete({ _id: new ObjectId(id) })

    if (!evento) {
      return res.sendStatus(404)
    }

    return res.sendStatus(204)
  } catch (err) {
    console.error(err)
    return res.sendStatus(400)
  }
})
