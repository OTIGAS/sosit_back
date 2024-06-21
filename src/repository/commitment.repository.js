import { db } from '../config/database.js'
import { UtilCheckHash, UtilGenerateHash, UtilGenerateToken } from '../util/cryptography.js'

export default class CommitmentRepository {
  async create(id_user, id_times, date_commitment) {
    let conn
    try {
      conn = await db()

      const [commitmentSelectResult] = await conn.query(
        `
          SELECT 
            COUNT(*)
          FROM
            commitment
          WHERE
            id_times = ? AND
            date_commitment = ? AND 
            commitment.deleted_at IS NULL
        `,
        [id_times, date_commitment]
      )

      if (commitmentSelectResult.affectedRows === 0) {
        return { error: `errorRegistration` }
      }

      const [commitmentInsertResult] = await conn.query(
        `
          INSERT INTO commitment (id_user, id_times, date_commitment)
          VALUES (?, ?, ?)
        `,
        [id_user, id_times, date_commitment]
      )

      if (commitmentInsertResult.affectedRows === 0) {
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

  async list(id_schedule) {
    let conn
    try {
      conn = await db()
      const [commitmentSelectResult] = await conn.query(
        `
          SELECT 
            user.id_user,
            user.name_user,
            user.cpf_user,
            DATE_FORMAT(user.date_of_birth, '%d/%m/%Y') AS date_of_birth,
            user.image_user,
            commitment.id_commitment,
            DATE_FORMAT(commitment.date_commitment, '%d/%m/%Y') AS date_commitment,
            commitment.description_commitment,
            commitment.rating,
            commitment.comment,
            times.id_times, 
            times.status, 
            times.start_time, 
            times.end_time, 
            times.day_week,
            schedule.id_schedule,
            schedule.is_active,
            schedule.name_schedule, 
            schedule.service_schedule,
            company.id_company,
            company.name_company,
            company.cnpj_company,
            company.more_information,
            company.image_company
          FROM 
            commitment
          LEFT JOIN
            user ON commitment.id_user = user.id_user
          LEFT JOIN
            times ON commitment.id_times = times.id_times
          LEFT JOIN
            schedule ON times.id_schedule = schedule.id_schedule
          LEFT JOIN
            company ON schedule.id_company = company.id_company
          WHERE (
              user.id_user = ? OR
              company.id_company = ? OR
              schedule.id_schedule = ? 
            ) AND
            commitment.deleted_at IS NULL
        `,
        [id_schedule]
      )
      return commitmentSelectResult
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async findById(id_schedule, date_commitment) {
    let conn
    try {
      conn = await db()
      console.log(id_schedule, date_commitment)
      const formattedDateCommitment = `${date_commitment}%`

      const [commitments] = await conn.query(
        `
        SELECT 
          c.id_commitment, 
          c.id_user, 
          c.id_times, 
          c.date_commitment, 
          c.description_commitment,
          t.start_time, 
          t.end_time, 
          t.day_week,
          t.status
        FROM 
          commitment c
        LEFT JOIN
          times t ON c.id_times = t.id_times
        WHERE 
          c.date_commitment LIKE ? AND
          t.id_schedule = ? AND
          t.deleted_at IS NULL AND
          c.deleted_at IS NULL
      `,
        [formattedDateCommitment, id_schedule]
      )

      return commitments
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async updateById(id, timeData) {
    let conn
    try {
      conn = await db()
      const { status, start_time, end_time, day_week } = timeData

      let updateFields = []
      let updateValues = []

      if (status) {
        updateFields.push('status = ?')
        updateValues.push(status)
      }

      if (start_time) {
        updateFields.push('start_time = ?')
        updateValues.push(start_time)
      }

      if (end_time) {
        updateFields.push('end_time = ?')
        updateValues.push(end_time)
      }

      if (day_week) {
        updateFields.push('day_week = ?')
        updateValues.push(day_week)
      }

      updateValues.push(id)

      const [result] = await conn.query(`UPDATE time SET ${updateFields.join(', ')} WHERE id_time = ?`, updateValues)

      if (result.affectedRows === 0) {
        return { error: 'errorUpdate' }
      }

      return { message: 'successfulUpdate' }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async delete(id_times) {
    let conn
    try {
      conn = await db()
      const [deletedAtUpdateResult] = await conn.query(
        `
          UPDATE 
            times
          SET
            deleted_at = now()
          WHERE
            id_times = ? 
        `,
        [id_times]
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
