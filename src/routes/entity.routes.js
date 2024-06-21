import { Router } from 'express'
const routes = Router()

import { check_token } from '../middleware/authentication.js'

import EntityController from '../controller/entity.controller.js'
const entityController = new EntityController()

import { upload } from '../config/multer.js'

import fs from 'fs'
import dotenv from 'dotenv'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../.env' })
const avatarPath = path.join(__dirname, '../../uploads')

routes.post(`/create`, entityController.create())

routes.post(`/login`, entityController.login())

routes.get(`/list`, entityController.list())

routes.get(`/list-companies`, entityController.listCompanies())

routes.get(`/list-commitments`, check_token, entityController.listCommitments())

routes.get(`/profile`, check_token, entityController.profile())

routes.get(`/find/:id`, entityController.find())

routes.put(`/update`, check_token, entityController.update())

routes.delete(`/delete`, check_token, entityController.delete())

routes.patch(`/image`, check_token, upload.single('image'), entityController.image())

routes.get('/image/:fileName', (req, res) => {
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
