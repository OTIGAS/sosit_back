import { db } from '../config/database.js'

export default class AvaliacaoRepository {
  cadastrar(body) {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
            INSERT INTO
              avaliacoes (
                numero
              )
            VALUES
              (?)
          `,
            [body?.numero]
          )
          .then(([response]) => {
            if (response?.affectedRows === 0) {
              return resolve({ erro: `Falha na inclusão da Avaliação.` })
            } else {
              return resolve({ mensagem: `Avaliação cadastrada com sucesso.` })
            }
          })
          .catch((error) => {
            if (error?.message?.includes(`Duplicate`)) {
              return resolve({ erro: `Avaliação já cadastrada.` })
            } else {
              console.log(error)
              return reject(new Error(error))
            }
          })
          .finally(() => {
            conn.end()
          })
      })
    })
  }

  buscar(id_avaliacao) {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
              SELECT
                a.id,
                a.numero
              FROM
                avaliacoes a
              WHERE
                a.id = ?
            `,
            [id_avaliacao]
          )
          .then(([response]) => {
            if (!response?.length) {
              return resolve({ erro: `Avaliação não encontrada.` })
            } else {
              return resolve({ avaliacao: response[0] })
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
            a.id,
            a.numero
          FROM
            avaliacoes a
            `,
            []
          )
          .then(([response]) => {
            return resolve({ avaliacoes: response })
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

  atualizar(body) {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
              UPDATE
                avaliacoes
              SET
                numero = ?
              WHERE
                id = ?
            `,
            [body?.numero, body?.id_avaliacao]
          )
          .then((response) => {
            if (response[0].affectedRows === 0) {
              return resolve({ erro: 'Avaliação não encontrada.' })
            } else {
              return resolve({ mensagem: 'Avaliação atualizada com sucesso.' })
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

  apagar(id_avaliacao) {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
              DELETE FROM
                avaliacoes
              WHERE
                id = ?
            `,
            [id_avaliacao]
          )
          .then((response) => {
            if (response[0].affectedRows === 0) {
              return resolve({ erro: 'Avaliação não encontrada.' })
            } else {
              return resolve({ mensagem: 'Avaliação apagada com sucesso.' })
            }
          })
          .catch((error) => {
            if (error?.message?.includes(`foreign key`)) {
              return resolve({ erro: `Avaliação associada a outra informação.` })
            } else {
              console.log(error)
              return reject(new Error(error))
            }
          })
          .finally(() => {
            conn.end()
          })
      })
    })
  }
}
