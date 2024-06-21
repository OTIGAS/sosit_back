import { db } from '../config/database.js'

import { convertDate, deconvertDate } from '../util/formatter.js'
import { UtilCheckHash, UtilGenerateHash, UtilGenerateToken } from '../util/cryptography.js'

import fs from 'fs'
import dotenv from 'dotenv'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: __dirname + '/./../../.env' })

export default class EntityRepository {
  async create(credential, contact, address, user, company) {
    let conn
    try {
      conn = await db()
      await conn.beginTransaction()

      const hashPasswordResult = await UtilGenerateHash(credential?.password_login)

      if (!hashPasswordResult) {
        await conn.rollback()
        return { error: `errorRegistration` }
      }

      const [credentialInsertResult] = await conn.query(
        `
          INSERT INTO credential (profile, email_login, password_login)
          VALUES (?, ?, ?)
        `,
        [credential?.profile, credential?.email_login, hashPasswordResult]
      )

      if (credentialInsertResult.affectedRows === 0) {
        await conn.rollback()
        return { error: `errorRegistration` }
      }

      const [contactInsertResult] = await conn.query(
        `
          INSERT INTO contact (id_credential, person_name, email_contact, phone_contact)
          VALUES (?, ?, ?, ?)
        `,
        [credentialInsertResult?.insertId, contact?.person_name, contact?.email_contact, contact?.phone_contact]
      )

      if (contactInsertResult.affectedRows === 0) {
        await conn.rollback()
        return { error: `errorRegistration` }
      }

      const [addressInsertResult] = await conn.query(
        `
          INSERT INTO address (id_credential, number, street, district, city, state, postal_code, complement)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          credentialInsertResult?.insertId,
          address?.number,
          address?.street,
          address?.district,
          address?.city,
          address?.state,
          address?.postal_code,
          address?.complement || '',
        ]
      )

      if (addressInsertResult.affectedRows === 0) {
        await conn.rollback()
        return { error: `errorRegistration` }
      }

      let userORCompanyInsertResult = []

      if (credential?.profile == 'company') {
        userORCompanyInsertResult = await conn.query(
          `
            INSERT INTO company (id_credential, name_company, cnpj_company, more_information)
            VALUES (?, ?, ?, ?)
          `,
          [credentialInsertResult?.insertId, company?.name_company, company?.cnpj_company, company?.more_information]
        )
      } else if (credential?.profile == 'user') {
        userORCompanyInsertResult = await conn.query(
          `
            INSERT INTO user (id_credential, name_user, cpf_user, date_of_birth)
            VALUES (?, ?, ?, ?)
          `,
          [credentialInsertResult?.insertId, user?.name_user, user?.cpf_user, deconvertDate(user?.date_of_birth)]
        )
      }

      if (userORCompanyInsertResult[0]?.affectedRows === 0) {
        await conn.rollback()
        return { error: `errorRegistration` }
      }

      await conn.commit()

      return { message: `successfulRegistration` }
    } catch (error) {
      console.error(error)
      if (error?.message?.includes(`Duplicate`)) {
        return { error: `errorDuplication` }
      } else if (error?.message?.includes(`Data too long`)) {
        return { error: `errorDataTooLong` }
      } else {
        throw error
      }
    } finally {
      if (conn) conn.end()
    }
  }

  async login(email, password) {
    let conn
    try {
      conn = await db()
      const [dataSelectResult] = await conn.query(
        `
          SELECT 
            cred.id_credential, 
            cred.profile, 
            cred.email_login, 
            cred.password_login,
            user.id_user,
            user.name_user,
            user.cpf_user,
            DATE_FORMAT(user.date_of_birth, '%d/%m/%Y') AS date_of_birth,
            comp.id_company,
            comp.name_company,
            comp.cnpj_company,
            comp.more_information,
            cont.id_contact,
            cont.person_name,
            cont.email_contact,
            cont.phone_contact,
            addr.id_address,
            addr.number,
            addr.street,
            addr.district,
            addr.city,
            addr.state,
            addr.postal_code,
            addr.complement
          FROM 
            credential cred 
          LEFT JOIN
            user user ON cred.id_credential = user.id_credential
          LEFT JOIN
            company comp ON cred.id_credential = comp.id_credential
          LEFT JOIN
            contact cont ON cred.id_credential = cont.id_credential
          LEFT JOIN
            address addr ON cred.id_credential = addr.id_credential
          WHERE 
            cred.email_login LIKE ? AND
            cred.deleted_at IS NULL
        `,
        [email]
      )

      if (dataSelectResult.length === 0) {
        return { error: `errorCredentials` }
      }

      const { password_login, ...data } = dataSelectResult[0]

      if (!password_login) {
        return { error: `errorCredentials` }
      }

      const passwordMatch = await UtilCheckHash(password, password_login)

      if (!passwordMatch) {
        return { error: `errorCredentials` }
      }

      const token = UtilGenerateToken({
        id_credential: data?.id_credential,
        id_user: data?.id_user,
        id_company: data?.id_company,
        profile: data?.profile,
      })

      return { token, data }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async list() {
    let conn
    try {
      conn = await db()
      const [data] = await conn.query(
        `
          SELECT 
            cred.id_credential, 
            cred.profile, 
            cred.email_login, 
            user.id_user,
            user.name_user,
            user.cpf_user,
            DATE_FORMAT(user.date_of_birth, '%d/%m/%Y') AS date_of_birth,
            comp.id_company,
            comp.name_company,
            comp.cnpj_company,
            comp.more_information,
            cont.id_contact,
            cont.person_name,
            cont.email_contact,
            cont.phone_contact,
            addr.id_address,
            addr.number,
            addr.street,
            addr.district,
            addr.city,
            addr.state,
            addr.postal_code,
            addr.complement
          FROM 
            credential cred 
          LEFT JOIN
            user user ON cred.id_credential = user.id_credential
          LEFT JOIN
            company comp ON cred.id_credential = comp.id_credential
          LEFT JOIN
            contact cont ON cred.id_credential = cont.id_credential
          LEFT JOIN
            address addr ON cred.id_credential = addr.id_credential
          WHERE 
            cred.deleted_at IS NULL
        `,
        []
      )
      return data
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async listCompanies(city, name_company, service) {
    let conn
    try {
      conn = await db()
      const [companiesSelectResult] = conn.query(
        `
          SELECT 
            company.name_company,
            company.cnpj_company,
            company.more_information,
            company.image_company,
            address.number,
            address.street,
            address.district,
            address.city,
            address.state,
            address.postal_code,
            address.complement,
            schedule.name_schedule,
            schedule.service_schedule,
            schedule.description_schedule
          FROM
            company
          LEFT JOIN
            credential ON company.id_credential = credential.id_credential 
          LEFT JOIN
            address ON credential.id_credential = address.id_credential
          LEFT JOIN
            schedule ON company.id_company = schedule.id_company
          WHERE (
            address.city LIKE ? OR
            company.name_company LIKE ? OR
            schedule.service_scheule LIKE ? 
          ) AND credential.deleted_at IS NULL
        `,
        [`%${city}%`, `%${name_company}%`, `%${service}%`]
      )
      return companiesSelectResult
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async listCommitments(id_user, id_company) {
    let conn
    try {
      conn = await db()
      const [userCommitments] = conn.query(
        `
          SELECT
            user.id_user,
            user.name_user,
            user.cpf_user,
            DATE_FORMAT(user.date_of_birth, '%d/%m/%Y') AS date_of_birth,
            company.id_company,
            company.name_company,
            company.cnpj_company,
            company.more_information,
            company.image_company,
            schedule.id_schedule,
            schedule.name_schedule,
            schedule.service_schedule,
            schedule.description_schedule
            times.id_times, 
            times.status, 
            times.start_time, 
            times.end_time, 
            times.day_week,
            commitment.id_commitment,
            commitment.date_commitment,
            commitment.description_commitment,
            commitment.assessment,
            commitment.comment
          FROM 
            user
          LEFT JOIN
            commitment ON user.id_user = commitment.id_user
          LEFT JOIN
            times ON commitment.id_times = times.id_times
          LEFT JOIN
            schedule ON times.id_schedule = times.id_schedule
          LEFT JOIN
            company ON schedule.id_company = company.id_company
          WHERE
            user.id_user = ? OR company.id_company = ?
          ORDER BY 
            commitment.date_commitment DESC
        `,
        [id_user, id_company]
      )
      return userCommitments
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async findById(id) {
    let conn
    try {
      conn = await db()
      const [data] = await conn.query(
        `
          SELECT 
            cred.id_credential, 
            cred.profile, 
            cred.email_login, 
            user.id_user,
            user.name_user,
            user.cpf_user,
            DATE_FORMAT(user.date_of_birth, '%d/%m/%Y') AS date_of_birth,
            user.image_user,
            comp.id_company,
            comp.name_company,
            comp.cnpj_company,
            comp.more_information,
            comp.image_company,
            cont.id_contact,
            cont.person_name,
            cont.email_contact,
            cont.phone_contact,
            addr.id_address,
            addr.number,
            addr.street,
            addr.district,
            addr.city,
            addr.state,
            addr.postal_code,
            addr.complement
          FROM 
            credential cred 
          LEFT JOIN
            user user ON cred.id_credential = user.id_credential
          LEFT JOIN
            company comp ON cred.id_credential = comp.id_credential
          LEFT JOIN
            contact cont ON cred.id_credential = cont.id_credential
          LEFT JOIN
            address addr ON cred.id_credential = addr.id_credential
          WHERE 
            cred.id_credential = ? AND
            cred.deleted_at IS NULL
        `,
        [id]
      )

      const token = UtilGenerateToken({
        id_credential: data[0]?.id_credential,
        id_user: data[0]?.id_user,
        id_company: data[0]?.id_company,
        profile: data[0]?.profile,
      })

      return { token, data: data[0] }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async updateCredential(id, credentialData) {
    let conn
    try {
      conn = await db()
      const { profile, email_login, password_login } = credentialData

      let updateFields = []
      let updateValues = []

      if (profile) {
        updateFields.push('profile = ?')
        updateValues.push(profile)
      }

      if (email_login) {
        updateFields.push('email_login = ?')
        updateValues.push(email_login)
      }

      if (password_login) {
        updateFields.push('password_login = ?')
        updateValues.push(password_login)
      }

      updateValues.push(id)

      const [result] = await conn.query(
        `UPDATE credential SET ${updateFields.join(', ')} WHERE id_credential = ?`,
        updateValues
      )

      if (result.affectedRows === 0) {
        return { error: 'errorUpdate' }
      }

      return { message: 'successfulUpdate' }
    } catch (error) {
      console.error(error)
      if (error?.message?.includes(`Duplicate`)) {
        return { error: `errorDuplication` }
      } else if (error?.message?.includes(`Data too long`)) {
        return { error: `errorDataTooLong` }
      } else {
        throw error
      }
    } finally {
      if (conn) conn.end()
    }
  }

  async updateUser(id, userData) {
    let conn
    try {
      conn = await db()
      const { name_user, cpf_user, date_of_birth } = userData

      let updateFields = []
      let updateValues = []

      if (name_user) {
        updateFields.push('name_user = ?')
        updateValues.push(name_user)
      }

      if (cpf_user) {
        updateFields.push('cpf_user = ?')
        updateValues.push(cpf_user)
      }

      if (date_of_birth) {
        updateFields.push('date_of_birth = ?')
        updateValues.push(convertDate(date_of_birth))
      }

      updateValues.push(id)

      const [result] = await conn.query(
        `UPDATE user SET ${updateFields.join(', ')} WHERE id_credential = ?`,
        updateValues
      )

      if (result.affectedRows === 0) {
        return { error: 'errorUpdate' }
      }

      return { message: 'successfulUpdate' }
    } catch (error) {
      console.error(error)
      if (error?.message?.includes(`Duplicate`)) {
        return { error: `errorDuplication` }
      } else if (error?.message?.includes(`Data too long`)) {
        return { error: `errorDataTooLong` }
      } else {
        throw error
      }
    } finally {
      if (conn) conn.end()
    }
  }

  async updateCompany(id, companyData) {
    let conn
    try {
      conn = await db()
      const { name_company, cnpj_company, more_information } = companyData

      let updateFields = []
      let updateValues = []

      if (name_company) {
        updateFields.push('name_company = ?')
        updateValues.push(name_company)
      }

      if (cnpj_company) {
        updateFields.push('cnpj_company = ?')
        updateValues.push(cnpj_company)
      }

      if (more_information) {
        updateFields.push('more_information = ?')
        updateValues.push(more_information)
      }

      updateValues.push(id)

      const [result] = await conn.query(
        `UPDATE company SET ${updateFields.join(', ')} WHERE id_credential = ?`,
        updateValues
      )

      if (result.affectedRows === 0) {
        return { error: 'errorUpdate' }
      }

      return { message: 'successfulUpdate' }
    } catch (error) {
      console.error(error)
      if (error?.message?.includes(`Duplicate`)) {
        return { error: `errorDuplication` }
      } else if (error?.message?.includes(`Data too long`)) {
        return { error: `errorDataTooLong` }
      } else {
        throw error
      }
    } finally {
      if (conn) conn.end()
    }
  }

  async updateContact(id, contactData) {
    let conn
    try {
      conn = await db()
      const { person_name, email_contact, phone_contact } = contactData

      let updateFields = []
      let updateValues = []

      if (person_name) {
        updateFields.push('person_name = ?')
        updateValues.push(person_name)
      }

      if (email_contact) {
        updateFields.push('email_contact = ?')
        updateValues.push(email_contact)
      }

      if (phone_contact) {
        updateFields.push('phone_contact = ?')
        updateValues.push(phone_contact)
      }

      updateValues.push(id)

      const [result] = await conn.query(
        `UPDATE contact SET ${updateFields.join(', ')} WHERE id_credential = ?`,
        updateValues
      )

      if (result.affectedRows === 0) {
        return { error: 'errorUpdate' }
      }

      return { message: 'successfulUpdate' }
    } catch (error) {
      console.error(error)
      if (error?.message?.includes(`Duplicate`)) {
        return { error: `errorDuplication` }
      } else if (error?.message?.includes(`Data too long`)) {
        return { error: `errorDataTooLong` }
      } else {
        throw error
      }
    } finally {
      if (conn) conn.end()
    }
  }

  async updateAddress(id, addressData) {
    let conn
    try {
      conn = await db()
      const { number, street, district, city, state, postal_code } = addressData

      let updateFields = []
      let updateValues = []

      if (number) {
        updateFields.push('number = ?')
        updateValues.push(number)
      }

      if (street) {
        updateFields.push('street = ?')
        updateValues.push(street)
      }

      if (district) {
        updateFields.push('district = ?')
        updateValues.push(district)
      }

      if (city) {
        updateFields.push('city = ?')
        updateValues.push(city)
      }

      if (state) {
        updateFields.push('state = ?')
        updateValues.push(state)
      }

      if (postal_code) {
        updateFields.push('postal_code = ?')
        updateValues.push(postal_code)
      }

      updateValues.push(id)

      const [result] = await conn.query(
        `UPDATE address SET ${updateFields.join(', ')} WHERE id_credential = ?`,
        updateValues
      )

      if (result.affectedRows === 0) {
        return { error: 'errorUpdate' }
      }

      return { message: 'successfulUpdate' }
    } catch (error) {
      console.error(error)
      if (error?.message?.includes(`Duplicate`)) {
        return { error: `errorDuplication` }
      } else if (error?.message?.includes(`Data too long`)) {
        return { error: `errorDataTooLong` }
      } else {
        throw error
      }
    } finally {
      if (conn) conn.end()
    }
  }

  async updatePassword(id, new_password, old_password) {
    let conn
    try {
      conn = await db()

      const [passwordSelectResult] = await conn.query(
        `
          SELECT 
            cred.password_login
          FROM 
            credential cred 
          WHERE 
            cred.id_credential = ? AND 
            cred.deleted_at IS NULL
        `,
        [id]
      )

      if (!passwordSelectResult[0].password_login) {
        return { error: `errorCredentials` }
      }

      const passwordMatch = await UtilCheckHash(old_password, passwordSelectResult[0].password_login)
      console.log(passwordMatch)
      if (!passwordMatch) {
        return { error: `errorCredentials` }
      }

      const hashPasswordResult = await UtilGenerateHash(new_password)

      if (!hashPasswordResult) {
        return { error: `errorUpdate` }
      }

      const [passwordUpdateResult] = await conn.query(
        `
          UPDATE 
            credential
          SET
            password_login = ?
          WHERE
            id_credential = ?
        `,
        [hashPasswordResult, id]
      )

      if (passwordUpdateResult.affectedRows === 0) {
        return { error: `errorUpdate` }
      }

      return { message: 'successfulUpdate' }
    } catch (error) {
      console.error(error)
      if (error?.message?.includes(`Data too long`)) {
        return { error: `errorDataTooLong` }
      } else {
        throw error
      }
    } finally {
      if (conn) conn.end()
    }
  }

  async imageUser(id_user, fileName) {
    let conn
    try {
      conn = await db()

      const [userSelectResult] = await conn.query(
        `
          SELECT
            id_user, 
            image_user
          FROM 
            user
          WHERE 
            id_user = ?
        `,
        [id_user]
      )

      if (!userSelectResult[0].id_user) {
        return { error: `errorCredentials` }
      }

      if (userSelectResult[0].image_user) {
        const oldImage = userSelectResult[0].image_user
        if (oldImage) {
          const oldImagePath = path.join(__dirname, '../../uploads/', oldImage)
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error(`Error deleting old image: ${err.message}`)
          })
        }
      }

      const [userUpdateResult] = await conn.query(
        `
          UPDATE 
            user
          SET
            image_user = ?
          WHERE
            id_user = ?
        `,
        [fileName, id_user]
      )

      if (userUpdateResult.affectedRows === 0) {
        return { error: `errorUpdate` }
      }

      return { message: 'successfulUpdate' }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async imageCompany(id_company, fileName) {
    let conn
    try {
      conn = await db()

      const [companySelectResult] = await conn.query(
        `
          SELECT
            id_company, 
            image_company
          FROM 
            company
          WHERE 
            id_company = ?
        `,
        [id_company]
      )

      if (!companySelectResult[0].id_company) {
        return { error: `errorCredentials` }
      }

      if (companySelectResult[0].image_company) {
        const oldImage = companySelectResult[0].image_company
        if (oldImage) {
          const oldImagePath = path.join(__dirname, '../../uploads', oldImage)
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error(`Error deleting old image: ${err.message}`)
          })
        }
      }

      const [companyUpdateResult] = await conn.query(
        `
          UPDATE 
            company
          SET
            image_company = ?
          WHERE
            id_company = ?
        `,
        [fileName, id_company]
      )

      if (companyUpdateResult.affectedRows === 0) {
        return { error: `errorUpdate` }
      }

      return { message: 'successfulUpdate' }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async delete(id) {
    let conn
    try {
      conn = await db()
      const [deletedAtUpdateResult] = await conn.query(
        `
          UPDATE 
            credential
          SET
            deleted_at = now()
          WHERE
            id_credential = ?
        `,
        [id]
      )

      if (deletedAtUpdateResult.affectedRows === 0) {
        return { error: `errorDelete` }
      }

      return { message: 'successfulDelete' }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }
}
