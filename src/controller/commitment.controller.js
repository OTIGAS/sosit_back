import CommitmentRepository from '../repository/commitment.repository.js'
const commitmentRepository = new CommitmentRepository()

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { ResponseSuccess, ResponseError, ResponseFailure } from '../util/handler.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

export default class TimeController {
  create() {
    return async (req, res) => {
      try {
        const { id_user, id_company } = req.user

        const { id_times, date_commitment } = req.body

        if ((!id_user && !id_company) || !id_times || !date_commitment) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await commitmentRepository.create(id_user || null, id_times, date_commitment)

        if (response.error) {
          return ResponseError(400, res, req, response)
        } else {
          return ResponseSuccess(200, res, req, response)
        }
      } catch (error) {
        console.log('error', error)
        return ResponseFailure(500, res, req, null, error)
      }
    }
  }

  list() {
    return async (req, res) => {
      try {
        const { id_schedule, date_commitment } = req.query

        if (!id_schedule || !date_commitment) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await commitmentRepository.list(id_schedule, date_commitment)
        if (response.error) {
          return ResponseError(400, res, req, response)
        } else {
          return ResponseSuccess(200, res, req, response)
        }
      } catch (error) {
        console.log('error', error)
        return ResponseFailure(500, res, req, null, error)
      }
    }
  }

  find() {
    return async (req, res) => {
      try {
        const { id_schedule, date_commitment } = req.query

        if (!id_schedule || !date_commitment) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await commitmentRepository.findById(id_schedule, date_commitment)

        if (response.error) {
          return ResponseError(404, res, req, response)
        } else {
          return ResponseSuccess(200, res, req, response)
        }
      } catch (error) {
        console.log('error', error)
        return ResponseFailure(500, res, req, null, error)
      }
    }
  }

  update() {
    return async (req, res) => {
      try {
        const { id_commitment } = req.query

        const { commitment } = req.body

        if (!id_commitment) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await commitmentRepository.updateById(id_commitment, commitment)

        if (response.error) {
          return ResponseError(400, res, req, response)
        } else {
          return ResponseSuccess(200, res, req, response)
        }
      } catch (error) {
        console.log('error', error)
        return ResponseFailure(500, res, req, null, error)
      }
    }
  }

  delete() {
    return async (req, res) => {
      try {
        const { id_times } = req.query

        if (!id_times) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await commitmentRepository.delete(id_times)

        if (response.error) {
          return ResponseError(404, res, req, response)
        } else {
          return ResponseSuccess(200, res, req, response)
        }
      } catch (error) {
        console.log('error', error)
        return ResponseFailure(500, res, req, null, error)
      }
    }
  }
}
