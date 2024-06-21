import { Router } from 'express'

import entityRoutes from './entity.routes.js'
import scheduleRoutes from './schedule.routes.js'
import timeRoutes from './time.routes.js'
import commitmentRoutes from './commitments.routes.js'

import fs from 'fs'
import dotenv from 'dotenv'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

const routes = Router()

routes.use('/entity', entityRoutes)
routes.use('/schedule', scheduleRoutes)
routes.use('/times', timeRoutes)
routes.use('/commitment', commitmentRoutes)

routes.get('/', (_req, res) => {
  res.status(200).json({ response: '🚀Server running🚀' })
})

routes.get('/uploads/:fileName', (req, res) => {
  const { fileName } = req.params

  if (!fileName) {
    return res.status(400).json({ error: 'missingParameters' })
  }

  const filePath = path.join(avatarPath, fileName)

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'fileNotFound' })
    }

    res.sendFile(filePath)
  })
})

export default routes
