import UsuarioRepository from '../repository/usuario.repository.js'
const usuarioRepository = new UsuarioRepository()

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { RespostaSucesso, RespostaErro, RespostaFalha } from '../utils/handler.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

export default class UsuarioController {
  entrar() {
    return (req, res) => {
      const body = req.body

      if (!body?.email || !body?.senha) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      usuarioRepository
        .entrar(body)
        .then((response) => {
          if (response.erro) {
            return RespostaErro(400, res, req, response)
          } else {
            return RespostaSucesso(200, res, req, response)
          }
        })
        .catch((error) => {
          return RespostaFalha(500, res, req, null, error)
        })
    }
  }

  cadastrar() {
    return (req, res) => {
      const body = req.body

      if (!body?.nome || !body?.email || !body?.senha || !body?.perfil) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      usuarioRepository
        .cadastrar(body)
        .then((response) => {
          if (response.erro) {
            return RespostaErro(400, res, req, response)
          } else {
            return RespostaSucesso(200, res, req, response)
          }
        })
        .catch((error) => {
          return RespostaFalha(500, res, req, null, error)
        })
    }
  }

  perfil() {
    return (req, res) => {
      const { id: id_usuario } = req.user

      if (!id_usuario) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      usuarioRepository
        .buscar(id_usuario)
        .then((response) => {
          if (response.erro) {
            return RespostaErro(400, res, req, response)
          } else {
            return RespostaSucesso(200, res, req, response)
          }
        })
        .catch((error) => {
          return RespostaFalha(500, res, req, null, error)
        })
    }
  }

  buscar() {
    return (req, res) => {
      const { id_usuario } = req.query

      if (!id_usuario) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      usuarioRepository
        .buscar(id_usuario)
        .then((response) => {
          if (response.erro) {
            return RespostaErro(400, res, req, response)
          } else {
            return RespostaSucesso(200, res, req, response)
          }
        })
        .catch((error) => {
          return RespostaFalha(500, res, req, null, error)
        })
    }
  }

  listar() {
    return (req, res) => {
      const { procurar } = req.query

      usuarioRepository
        .listar(procurar || '')
        .then((response) => {
          if (response.erro) {
            return RespostaErro(400, res, req, response)
          } else {
            return RespostaSucesso(200, res, req, response)
          }
        })
        .catch((error) => {
          return RespostaFalha(500, res, req, null, error)
        })
    }
  }

  atualizar() {
    return (req, res) => {
      const { id: id_usuario } = req.user

      if (!id_usuario) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      const body = req.body

      if (!body?.nome || !body?.email || !body?.perfil) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      usuarioRepository
        .atualizar(id_usuario, body)
        .then((response) => {
          if (response.erro) {
            return RespostaErro(400, res, req, response)
          } else {
            return RespostaSucesso(200, res, req, response)
          }
        })
        .catch((error) => {
          return RespostaFalha(500, res, req, null, error)
        })
    }
  }

  atualizarSenha() {
    return (req, res) => {
      const { id: id_usuario } = req.user

      if (!id_usuario) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      const body = req.body

      if (!body?.senha_antiga || !body?.senha_nova) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      usuarioRepository
        .atualizarSenha(id_usuario, body)
        .then((response) => {
          if (response.erro) {
            return RespostaErro(400, res, req, response)
          } else {
            return RespostaSucesso(200, res, req, response)
          }
        })
        .catch((error) => {
          return RespostaFalha(500, res, req, null, error)
        })
    }
  }

  atualizarStatus() {
    return (req, res) => {
      const { id_usuario } = req.query

      if (!id_usuario) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      usuarioRepository
        .atualizarStatus(id_usuario)
        .then((response) => {
          if (response.erro) {
            return RespostaErro(400, res, req, response)
          } else {
            return RespostaSucesso(200, res, req, response)
          }
        })
        .catch((error) => {
          return RespostaFalha(500, res, req, null, error)
        })
    }
  }

  apagar() {
    return (req, res) => {
      const { id_usuario } = req.query

      if (!id_usuario) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      usuarioRepository
        .apagar(id_usuario)
        .then((response) => {
          if (response.erro) {
            return RespostaErro(400, res, req, response)
          } else {
            return RespostaSucesso(200, res, req, response)
          }
        })
        .catch((error) => {
          return RespostaFalha(500, res, req, null, error)
        })
    }
  }
}
