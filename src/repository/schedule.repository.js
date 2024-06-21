import { db } from '../config/database.js'

export default class UserRepository {
  async create(id_company, schedule) {
    let conn
    try {
      conn = await db()

      const [scheduleInsertResult] = await conn.query(
        `
          INSERT INTO schedule (id_company, name_schedule, service_schedule, description_schedule)
          VALUES (?, ?, ?, ?)
        `,
        [id_company, schedule?.name_schedule, schedule?.service_schedule, schedule?.description_schedule]
      )

      if (scheduleInsertResult.affectedRows === 0) {
        return { error: `errorRegistration` }
      }

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

  async list(id_company, { name_schedule, service_schedule }) {
    let conn
    try {
      conn = await db()
      const [scheduleSelectResult] = await conn.query(
        `
          SELECT 
            schedule.id_company, 
            schedule.id_schedule,
            schedule.is_active,
            schedule.name_schedule, 
            schedule.service_schedule, 
            schedule.description_schedule, 
            DATE_FORMAT(schedule.created_at, '%d/%m/%Y %H:%i') AS created_at, 
            DATE_FORMAT(schedule.updated_at, '%d/%m/%Y %H:%i') AS updated_at,
            AVG(commitment.rating) AS rating
          FROM 
            schedule
          LEFT JOIN
            times ON schedule.id_schedule = times.id_schedule
          LEFT JOIN
            commitment ON times.id_times = commitment.id_times
          WHERE (
              schedule.name_schedule LIKE ? AND
              schedule.service_schedule LIKE ?
            ) AND schedule.id_company = ? AND 
            schedule.deleted_at IS NULL AND
            times.deleted_at IS NULL AND
            commitment.deleted_at IS NULL
          GROUP BY 
            schedule.id_company,
            schedule.id_schedule,
            schedule.is_active,
            schedule.name_schedule, 
            schedule.service_schedule, 
            schedule.description_schedule, 
            schedule.created_at,
            schedule.updated_at
        `,
        [`%${name_schedule}%`, `%${service_schedule}%`, id_company]
      )

      return scheduleSelectResult
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async listForUser({ city, name_company, name_schedule, service_schedule }) {
    let conn
    try {
      conn = await db()
      const [scheduleSelectResult] = await conn.query(
        `
          SELECT 
            schedule.id_company, 
            schedule.id_schedule,
            schedule.is_active,
            schedule.name_schedule, 
            schedule.service_schedule, 
            schedule.description_schedule, 
            DATE_FORMAT(schedule.created_at, '%d/%m/%Y %H:%i') AS created_at, 
            DATE_FORMAT(schedule.updated_at, '%d/%m/%Y %H:%i') AS updated_at,
            company.name_company,
            company.cnpj_company,
            company.more_information,
            company.image_company,
            address.id_address,
            address.number,
            address.street,
            address.district,
            address.city,
            address.state,
            address.postal_code,
            address.complement,
            AVG(commitment.rating) AS rating,
            GROUP_CONCAT(DISTINCT times.day_week ORDER BY times.day_week) AS days_week
          FROM 
            schedule
          LEFT JOIN
            company ON schedule.id_company = company.id_company
          LEFT JOIN
            address ON company.id_credential = address.id_credential
          LEFT JOIN
            times ON schedule.id_schedule = times.id_schedule
          LEFT JOIN
            commitment ON times.id_times = commitment.id_times
          WHERE 
            address.city LIKE ? AND
            company.name_company LIKE ? AND
            schedule.name_schedule LIKE ? AND
            schedule.service_schedule LIKE ? AND
            schedule.is_active = 1 AND
            schedule.deleted_at IS NULL AND
            company.deleted_at IS NULL AND
            address.deleted_at IS NULL AND
            times.deleted_at IS NULL AND
            commitment.deleted_at IS NULL
          GROUP BY 
            schedule.id_company,
            schedule.id_schedule,
            schedule.is_active,
            schedule.name_schedule, 
            schedule.service_schedule, 
            schedule.description_schedule, 
            schedule.created_at,
            schedule.updated_at,
            company.name_company,
            company.cnpj_company,
            company.more_information,
            company.image_company,
            address.id_address,
            address.number,
            address.street,
            address.district,
            address.city,
            address.state,
            address.postal_code,
            address.complement
        `,
        [`%${city}%`, `%${name_company}%`, `%${name_schedule}%`, `%${service_schedule}%`]
      )
      return scheduleSelectResult
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async findById(id_schedule) {
    let conn
    try {
      conn = await db()

      const [scheduleSelectResult] = await conn.query(
        `
          SELECT 
            schedule.id_company, 
            schedule.id_schedule,
            schedule.is_active,
            schedule.name_schedule, 
            schedule.service_schedule, 
            schedule.description_schedule, 
            DATE_FORMAT(schedule.created_at, '%d/%m/%Y %H:%i') AS created_at, 
            DATE_FORMAT(schedule.updated_at, '%d/%m/%Y %H:%i') AS updated_at,
            company.name_company,
            company.cnpj_company,
            company.more_information,
            company.image_company,
            address.id_address,
            address.number,
            address.street,
            address.district,
            address.city,
            address.state,
            address.postal_code,
            address.complement,
            AVG(commitment.rating) AS rating,
            GROUP_CONCAT(DISTINCT times.day_week ORDER BY times.day_week) AS days_week
          FROM 
            schedule
          LEFT JOIN
            company ON schedule.id_company = company.id_company
          LEFT JOIN
            address ON company.id_credential = address.id_credential
          LEFT JOIN
            times ON schedule.id_schedule = times.id_schedule
          LEFT JOIN
            commitment ON times.id_times = commitment.id_times
          WHERE 
            address.city LIKE ? AND
            schedule.deleted_at IS NULL AND
            company.deleted_at IS NULL AND
            address.deleted_at IS NULL AND
            times.deleted_at IS NULL AND
            commitment.deleted_at IS NULL
          GROUP BY 
            schedule.id_company,
            schedule.id_schedule,
            schedule.is_active,
            schedule.name_schedule, 
            schedule.service_schedule, 
            schedule.description_schedule, 
            schedule.created_at,
            schedule.updated_at,
            company.name_company,
            company.cnpj_company,
            company.more_information,
            company.image_company,
            address.id_address,
            address.number,
            address.street,
            address.district,
            address.city,
            address.state,
            address.postal_code,
            address.complement
        `,
        [id_company, id_schedule]
      )
      return scheduleSelectResult
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async updateById(id_company, id_schedule, scheduleData) {
    let conn
    try {
      conn = await db()
      const { is_active, name_schedule, service_schedule, description_schedule } = scheduleData

      let updateFields = []
      let updateValues = []

      if (is_active === true || is_active === false) {
        updateFields.push('is_active = ?')
        updateValues.push(is_active)
      }

      if (name_schedule) {
        updateFields.push('name_schedule = ?')
        updateValues.push(name_schedule)
      }

      if (service_schedule) {
        updateFields.push('service_schedule = ?')
        updateValues.push(service_schedule)
      }

      if (description_schedule) {
        updateFields.push('description_schedule = ?')
        updateValues.push(description_schedule)
      }

      updateValues.push(id_company, id_schedule)

      const [result] = await conn.query(
        `UPDATE schedule SET ${updateFields.join(', ')} WHERE id_company = ? AND id_schedule = ?`,
        updateValues
      )

      if (result.affectedRows === 0) {
        return { error: 'errorUpdate' }
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

  async delete(id_company, id_schedule) {
    let conn
    try {
      conn = await db()
      const [deletedAtUpdateResult] = await conn.query(
        `
          UPDATE 
            schedule
          SET
            deleted_at = now()
          WHERE
            id_company = ? AND 
            id_schedule = ?
        `,
        [id_company, id_schedule]
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
