import { Router } from 'express'
const routes = Router()

import { check_token } from '../middleware/authentication.js'

import ScheduleController from '../controller/schedule.controller.js'
const scheduleController = new ScheduleController()

routes.post(`/create`, check_token, scheduleController.create())

routes.get(`/list`, check_token, scheduleController.list())

routes.get(`/find`, check_token, scheduleController.find())

routes.put(`/update`, check_token, scheduleController.update())

routes.delete(`/delete`, check_token, scheduleController.delete())

export default routes
