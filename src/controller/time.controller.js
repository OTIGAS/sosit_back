import TimeRepository from '../repository/time.repository.js'
const timeRepository = new TimeRepository()

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
        const { id_schedule, time } = req.body

        if (!id_schedule || !time?.start_time || !time?.end_time || !time?.day_week) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await timeRepository.create(id_schedule, time)

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
        const { id_schedule, day_week } = req.query

        if (!id_schedule) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await timeRepository.list(id_schedule, day_week)
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
        const { id_times } = req.query

        if (!id_times) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await timeRepository.findById(id_times)

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
        const { id_times } = req.query

        const { time } = req.body

        if (!id_times) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await timeRepository.updateById(id_times, time)

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

        const response = await timeRepository.delete(id_times)

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
