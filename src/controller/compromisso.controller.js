import CompromissoRepository from '../repository/compromisso.repository.js'
const compromissoRepository = new CompromissoRepository()

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

      if (!body?.id_usuario || !body?.id_horario || !body?.dt_completa || !body?.descricao) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      compromissoRepository
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
      const { id_compromisso } = req.query

      if (!id_compromisso) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      compromissoRepository
        .buscar(id_compromisso)
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

      compromissoRepository
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

      if (!body?.nome || !body?.servico || !body?.descricao || !body?.id_compromisso) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      compromissoRepository
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
      const { id_compromisso } = req.query

      if (!id_compromisso) {
        const response = { erro: 'Parâmetros ausentes.' }
        return RespostaErro(400, res, req, response)
      }

      compromissoRepository
        .apagar(id_compromisso)
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
