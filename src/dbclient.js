import { MongoClient, ServerApiVersion } from 'mongodb'

const client = new MongoClient(process.env.DB_CONN_STR, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

export default client
