import { Router } from 'express'
const routes = Router()

import { verifica_token } from '../config/autenticacao.js'

import AvaliacaoController from '../controller/avaliacao.controller.js'
const avaliacaoController = new AvaliacaoController()

routes.post(`/cadastrar`, avaliacaoController.cadastrar())

routes.get(`/buscar`, avaliacaoController.buscar())

routes.get(`/listar`, avaliacaoController.listar())

routes.patch(`/atualizar`, avaliacaoController.atualizar())

routes.delete(`/apagar`, avaliacaoController.apagar())

export default routes
