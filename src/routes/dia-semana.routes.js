import { Router } from 'express'
const routes = Router()

import { verifica_token } from '../config/autenticacao.js'

import DiaSemanaController from '../controller/dia-semana.controller.js'
const diaSemanaController = new DiaSemanaController()

routes.get(`/buscar`, diaSemanaController.buscar())

routes.get(`/listar`, diaSemanaController.listar())

export default routes
