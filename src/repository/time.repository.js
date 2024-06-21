import { db } from '../config/database.js'
import { UtilCheckHash, UtilGenerateHash, UtilGenerateToken } from '../util/cryptography.js'

export default class TimeRepository {
  async create(id_schedule, time) {
    let conn
    try {
      conn = await db()

      const getMinutesFromMidnight = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number)
        return hours * 60 + minutes
      }

      const startTimeMinutes = getMinutesFromMidnight(time.start_time)
      const endTimeMinutes = getMinutesFromMidnight(time.end_time)

      if (startTimeMinutes >= endTimeMinutes) {
        return { error: 'errorRegistration' }
      }

      const [existingTimes] = await conn.query(
        `
          SELECT *
          FROM times
          WHERE deleted_at IS NULL 
            AND id_schedule = ?
            AND day_week = ?
            AND (
              (start_time <= ? AND end_time >= ?)
              OR (start_time <= ? AND end_time >= ?)
              OR (start_time >= ? AND end_time <= ?)
            )
        `,
        [
          id_schedule,
          time?.day_week,
          time?.start_time,
          time?.start_time,
          time?.end_time,
          time?.end_time,
          time?.start_time,
          time?.end_time,
        ]
      )

      if (existingTimes.length > 0) {
        return { error: `errorDuplication` }
      }

      const [timeInsertResult] = await conn.query(
        `
          INSERT INTO times (id_schedule, start_time, end_time, day_week)
          VALUES (?, ?, ?, ?)
        `,
        [id_schedule, time?.start_time, time?.end_time, time?.day_week]
      )

      if (timeInsertResult.affectedRows === 0) {
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

  async list(id_schedule, day_week) {
    let conn
    try {
      conn = await db()
      const [timeSelectResult] = await conn.query(
        `
          SELECT 
            times.id_times, 
            times.id_schedule, 
            times.status, 
            times.start_time, 
            times.end_time, 
            times.day_week,
            schedule.name_schedule,
            schedule.service_schedule
          FROM 
            times
          LEFT JOIN
            schedule ON times.id_schedule = schedule.id_schedule
          WHERE 
            times.id_schedule = ? AND
            times.day_week = ? AND
            times.deleted_at IS NULL
          ORDER BY 
            start_time ASC
        `,
        [id_schedule, day_week]
      )
      return timeSelectResult
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async listForUser(id_schedule, day_week) {
    let conn
    try {
      conn = await db()
      const [commitmentSelectResult] = await conn.query(
        `
          SELECT
            commitment.*,
            times.id_times, 
            times.id_schedule, 
            times.status, 
            times.start_time, 
            times.end_time, 
            times.day_week
          FROM
            commitment
          LEFT JOIN
            times ON times.id_times = commitment.id_times
          WHERE
            times.id_schedule = ? AND
            times.day_week = ? AND
            commitment.deleted_at IS NULL AND
            times.deleted_at IS NULL
        `,
        [id_schedule, day_week]
      )
      return commitmentSelectResult
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      if (conn) conn.end()
    }
  }

  async findById(id_times) {
    let conn
    try {
      conn = await db()
      const [time] = await conn.query(
        `
          SELECT
            id_times, 
            id_schedule, 
            status, 
            start_time, 
            end_time, 
            day_week
          FROM 
            time 
          WHERE 
            id_times = ? AND
            deleted_at IS NULL
        `,
        [id_times]
      )

      return time
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
