import { Router } from 'express'
const routes = Router()

import { verifica_token } from '../config/autenticacao.js'

import AgendaController from '../controller/agenda.controller.js'
const agendaController = new AgendaController()

routes.post(`/cadastrar`, agendaController.cadastrar())

routes.get(`/buscar`, agendaController.buscar())

routes.get(`/listar`, agendaController.listar())

routes.patch(`/atualizar`, agendaController.atualizar())

routes.delete(`/apagar`, agendaController.apagar())

export default routes