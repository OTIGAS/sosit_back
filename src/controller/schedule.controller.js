import ScheduleRepository from '../repository/schedule.repository.js'
const scheduleRepository = new ScheduleRepository()

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { ResponseSuccess, ResponseError, ResponseFailure } from '../util/handler.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

export default class ScheduleController {
  create() {
    return async (req, res) => {
      try {
        const { id_company } = req.user

        const { name_schedule, service_schedule, description_schedule } = req.body

        if (!id_company || !name_schedule || !service_schedule || !description_schedule) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await scheduleRepository.create(id_company, {
          name_schedule,
          service_schedule,
          description_schedule,
        })
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
        const { id_company, id_user } = req.user

        if (!id_company && !id_user) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        let response
        if (id_company) {
          const { name_schedule, service_schedule } = req.query

          response = await scheduleRepository.list(id_company, {
            name_schedule: name_schedule || '',
            service_schedule: service_schedule || '',
          })
        } else if (id_user) {
          const { city, name_company, name_schedule, service_schedule } = req.query
          response = await scheduleRepository.listForUser({
            city: city || '',
            name_company: name_company || '',
            name_schedule: name_schedule || '',
            service_schedule: service_schedule || '',
          })
        }

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
        const { id_schedule } = req.query

        if (!id_schedule) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await scheduleRepository.findById(id_schedule)

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
        const { id_company } = req.user

        const { id_schedule } = req.query

        if (!id_company || !id_schedule) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const { is_active, name_schedule, service_schedule, description_schedule } = req.body

        const response = await scheduleRepository.updateById(id_company, id_schedule, {
          is_active,
          name_schedule,
          service_schedule,
          description_schedule,
        })

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
        const { id_schedule } = req.query

        const { id_company } = req.user

        if (!id_schedule || !id_company) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await scheduleRepository.delete(id_schedule, id_company)

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
