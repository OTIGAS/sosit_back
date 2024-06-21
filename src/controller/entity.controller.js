import EntityRepository from '../repository/entity.repository.js'
const entityRepository = new EntityRepository()

import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { ResponseSuccess, ResponseError, ResponseFailure } from '../util/handler.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../../.env' })

export default class EntityController {
  create() {
    return async (req, res) => {
      try {
        const { credential, contact, address, user, company } = req.body

        if (!credential?.profile || !credential?.email_login || !credential?.password_login) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        if (!contact?.person_name || !contact?.email_contact || !contact?.phone_contact) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        if (
          !address?.number ||
          !address?.street ||
          !address?.district ||
          !address?.city ||
          !address?.state ||
          !address?.postal_code
        ) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        if (credential?.profile == 'user') {
          if (!user?.name_user || !user?.cpf_user || !user?.date_of_birth) {
            const response = { error: 'missingParameters' }
            return ResponseError(400, res, req, response)
          }
        }

        if (credential?.profile == 'company') {
          if (!company?.name_company || !company?.cnpj_company || !company?.more_information) {
            const response = { error: 'missingParameters' }
            return ResponseError(400, res, req, response)
          }
        }

        const response = await entityRepository.create(credential, contact, address, user, company)
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

  login() {
    return async (req, res) => {
      try {
        const { email, password } = req.body

        if (!email || !password) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await entityRepository.login(email, password)
        if (response.error) {
          return ResponseError(400, res, req, response)
        } else {
          return ResponseSuccess(200, res, req, response)
        }
      } catch (error) {
        return ResponseFailure(500, res, req, null, error)
      }
    }
  }

  list() {
    return async (req, res) => {
      try {
        const response = await entityRepository.list()
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

  listCompanies() {
    return async (req, res) => {
      try {
        const { city, name_company } = req.query
        const response = await entityRepository.listCompanies(city || '', name_company || '', service || '')
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

  listCommitments() {
    return async (req, res) => {
      try {
        const { id_user, id_company } = req.user

        if (!id_user && !id_company) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await entityRepository.listCommitments(id_user || '', id_company || '')
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

  profile() {
    return async (req, res) => {
      try {
        const { id_credential: id } = req.user
        const response = await entityRepository.findById(id)

        if (!id) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

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

  find() {
    return async (req, res) => {
      try {
        const { id } = req.params
        const response = await entityRepository.findById(id)

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
        const { id_credential: id } = req.user
        const { content, credential, user, company, contact, address, password } = req.body

        let response

        if (content == 'credential') {
          response = await entityRepository.updateCredential(id, credential)
        } else if (content == 'user') {
          response = await entityRepository.updateUser(id, user)
        } else if (content == 'company') {
          response = await entityRepository.updateCompany(id, company)
        } else if (content == 'contact') {
          response = await entityRepository.updateContact(id, contact)
        } else if (content == 'address') {
          response = await entityRepository.updateAddress(id, address)
        } else if (content == 'password') {
          response = await entityRepository.updatePassword(id, password.new_password, password.old_password)
        } else {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
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

  image() {
    return async (req, res) => {
      try {
        const { id_user, id_company } = req.user

        if (!req.file) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const fileName = req.file.filename

        let response

        if (id_user) {
          response = await entityRepository.imageUser(id_user, fileName)
        } else if (id_company) {
          response = await entityRepository.imageCompany(id_company, fileName)
        } else {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        if (response.error) {
          return ResponseError(400, res, req, response)
        } else {
          return ResponseSuccess(200, res, req, response)
        }
      } catch (error) {
        return ResponseFailure(500, res, req, null, error)
      }
    }
  }

  delete() {
    return async (req, res) => {
      try {
        const { id_credential: id } = req.user

        if (!id) {
          const response = { error: 'missingParameters' }
          return ResponseError(400, res, req, response)
        }

        const response = await entityRepository.delete(id)

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
