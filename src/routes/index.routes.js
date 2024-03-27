import { Router } from 'express'

import usuarioRoutes from './usuario.routes.js'
import agendaRoutes from './agenda.routes.js'
import diaSemanaRoutes from './dia-semana.routes.js'
import horarioRoutes from './horario.routes.js'

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

const routes = Router()

routes.use('/usuario', usuarioRoutes)
routes.use('/agenda', agendaRoutes)
routes.use('/dia-semana', diaSemanaRoutes)
routes.use('/horario', horarioRoutes)

routes.get('/', (_req, res) => {
  res.status(200).json({ response: 'Servidor rodando.' })
})

export default routes
