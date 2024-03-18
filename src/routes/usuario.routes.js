import { Router } from 'express'
const routes = Router()

import { verifica_token } from '../config/autenticacao.js'

import UsuarioController from '../controller/usuario.controller.js'
const usuarioController = new UsuarioController()

routes.post(`/entrar`, usuarioController.entrar())

routes.post(`/cadastrar`, usuarioController.cadastrar())

routes.get(`/perfil`, verifica_token, usuarioController.perfil())

routes.get(`/buscar`, usuarioController.buscar())

routes.get(`/listar`, usuarioController.listar())

routes.patch(`/atualizar`, usuarioController.atualizar())

routes.put(`/atualizar-senha`, usuarioController.atualizarSenha())

routes.put(`/atualizar-status`, usuarioController.atualizarStatus())

routes.delete(`/apagar`, usuarioController.apagar())

export default routes