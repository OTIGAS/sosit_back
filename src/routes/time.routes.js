import { Router } from 'express'
const routes = Router()

import { check_token } from '../middleware/authentication.js'

import TimeController from '../controller/time.controller.js'
const timeController = new TimeController()

routes.post(`/create`, check_token, timeController.create())

routes.get(`/list`, check_token, timeController.list())

routes.get(`/find`, check_token, timeController.find())

routes.put(`/update`, check_token, timeController.update())

routes.delete(`/delete`, check_token, timeController.delete())

export default routes
