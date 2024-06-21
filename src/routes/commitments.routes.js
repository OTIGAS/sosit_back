import { Router } from 'express'
const routes = Router()

import { check_token } from '../middleware/authentication.js'

import CommitmentController from '../controller/commitment.controller.js'
const commitmentController = new CommitmentController()

routes.post(`/create`, check_token, commitmentController.create())

routes.get(`/list`, check_token, commitmentController.list())

routes.get(`/find`, check_token, commitmentController.find())

routes.put(`/update`, check_token, commitmentController.update())

routes.delete(`/delete`, check_token, commitmentController.delete())

export default routes
