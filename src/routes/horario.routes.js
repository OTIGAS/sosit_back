import { Router } from 'express'
const routes = Router()

import { verifica_token } from '../config/autenticacao.js'

import HorarioController from '../controller/horario.controller.js'
const horarioController = new HorarioController()

routes.post(`/cadastrar`, horarioController.cadastrar())

routes.get(`/buscar`, horarioController.buscar())

routes.get(`/listar`, horarioController.listar())

routes.patch(`/atualizar`, horarioController.atualizar())

routes.delete(`/apagar`, horarioController.apagar())

export default routes