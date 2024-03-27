import { db } from '../config/database.js'

export default class AgendaRepository {
  buscar(id_dia) {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
              SELECT
                ds.id,
                ds.nome
              FROM
                dia_semana ds
              WHERE
                ds.id = ?
            `,
            [id_dia]
          )
          .then(([response]) => {
            if (!response?.length) {
              return resolve({ erro: `Dia não encontrado.` })
            } else {
              return resolve({ dia: response[0] })
            }
          })
          .catch((error) => {
            console.log(error)
            return reject(new Error(error))
          })
          .finally(() => {
            conn.end()
          })
      })
    })
  }

  listar() {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
              SELECT
                ds.id,
                ds.nome
              FROM
                dia_semana ds
            `,
            []
          )
          .then(([response]) => {
            return resolve({ dias: response })
          })
          .catch((error) => {
            console.log(error)
            return reject(new Error(error))
          })
          .finally(() => {
            conn.end()
          })
      })
    })
  }
}
