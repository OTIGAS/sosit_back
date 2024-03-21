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

      if (!body?.id_dia || !body?.id_agenda || !body?.inicio || !body?.fim) {
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
      const { id_horario } = req.query

      if (!id_horario) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      horarioRepository
        .buscar(id_horario)
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

      horarioRepository
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
      const body = req.body

      if (!body?.id_horario) {
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
      const { id_horario } = req.query

      if (!id_horario) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      horarioRepository
        .apagar(id_horario)
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
