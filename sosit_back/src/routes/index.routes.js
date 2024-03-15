import { Router } from 'express'

import usuarioRoutes from './usuario.routes.js'

import { RespostaSucesso, RespostaErro, RespostaFalha } from '../utils/handler.js'

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

const routes = Router()

routes.get('/', (_req, res) => {
  res.status(200).json({ response: 'Servidor rodando.' })
})

routes.use('/usuario', usuarioRoutes)

// routes.post('/', (req, res) => {

// })

export default routes
