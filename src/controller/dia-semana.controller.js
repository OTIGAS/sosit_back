import DiaSemanaRepository from '../repository/dia-semana.repository.js'
const diaSemanaRepository = new DiaSemanaRepository()

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { RespostaSucesso, RespostaErro, RespostaFalha } from '../utils/handler.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

export default class DiaSemanaController {
  buscar() {
    return (req, res) => {
      const { id_dia } = req.query

      if (!id_dia) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      diaSemanaRepository
        .buscar(id_dia)
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
      diaSemanaRepository
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
}
