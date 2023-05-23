import { Router } from 'express'

const router = Router()

export default router
export { router }

router.get('/', (req, res) => {
  return res.status(200).send([
    {
      eventos: `${req.protocol}://${req.get('host')}/eventos`,
    },
    {
      ingressos: `${req.protocol}://${req.get('host')}/ingressos`,
    },
  ])
})
