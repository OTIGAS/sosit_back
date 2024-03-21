import { Router } from 'express'
const routes = Router()

import { verifica_token } from '../config/autenticacao.js'

import CompromissoController from '../controller/compromisso.controller.js'
const compromissoController = new CompromissoController()

routes.post(`/cadastrar`, compromissoController.cadastrar())

routes.get(`/buscar`, compromissoController.buscar())

routes.get(`/listar`, compromissoController.listar())

routes.patch(`/atualizar`, compromissoController.atualizar())

routes.delete(`/apagar`, compromissoController.apagar())

export default routes