import HorarioRepository from '../repository/horario.repository.js'
const horarioRepository = new HorarioRepository()

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { RespostaSucesso, RespostaErro, RespostaFalha } from '../utils/handler.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

export default class AgendaController {
  cadastrar() {
    return (req, res) => {
      const body = req.body

      if (!body?.numero) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      horarioRepository
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

  buscar() {
    return (req, res) => {
      const { id_avaliacao } = req.query

      if (!id_avaliacao) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      horarioRepository
        .buscar(id_avaliacao)
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
      horarioRepository
        .listar()
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
      const body = req.body

      if (!body?.id_avaliacao || !body?.numero) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      horarioRepository
        .atualizar(body)
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
      const { id_avaliacao } = req.query

      if (!id_avaliacao) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      horarioRepository
        .apagar(id_avaliacao)
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
