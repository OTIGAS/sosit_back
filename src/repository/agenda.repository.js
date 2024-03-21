import { db } from '../config/database.js'

export default class AgendaRepository {
  cadastrar(body) {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
            INSERT INTO
              agendas (
                nome,
                servico,
                descricao,
                ativo
              )
            VALUES
              (?,?,?,1)
          `,
            [
              body?.nome,
              body?.servico,
              body?.descricao
            ]
          )
          .then(([response]) => {
            if (response?.affectedRows === 0) {
              return resolve({ erro: `Falha na inclusão da Agenda` })
            } else {
              return resolve({ mensagem: `Agenda cadastrada com sucesso.` })
            }
          })
          .catch((error) => {
            if (error?.message?.includes(`Duplicate`)) {
              return resolve({ erro: `Agenda já cadastrada.` })
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

  buscar(id_agenda) { // confirmar
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
              SELECT
                a.id
                a.nome,
                a.servico,
                a.descricao
                u.nome
              FROM
                agendas a
              LEFT JOIN 
                usuario u ON a.id_usuario = u.id
              WHERE
                a.id = ?
                AND a.ativo = 1
            `,
            [id_agenda]
          )
          .then(([response]) => {
            if (!response?.length) {
              return resolve({ erro: `Agenda não encontrada.` })
            } else if (response?.ativo == 0) {
              return resolve({ erro: `Registro da agenda apagada.` })
            } else {
              return resolve({ agenda: response[0] })
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

  listar(procurar) {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
              SELECT
                a.id
                a.nome,
                a.servico,
                a.descricao
                u.nome
              FROM
                agendas a
              LEFT JOIN 
                usuario u ON a.id_usuario = u.id
              WHERE
                (
                  u.nome LIKE ?
                  OR a.nome LIKE ?
                  OR a.descricao LIKE ?
                )
                AND a.ativo = 1
            `,
            [`%${procurar}%`, `%${procurar}%`, `%${procurar}%`]
          )
          .then(([response]) => {
            return resolve({ agendas: response })
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
                agendas
              SET
                nome = ?,
                servico = ?,
                descricao = ?
              WHERE
                id = ?
          `,
            [body?.nome, body?.servico, body?.descricao, body?.id_agenda]
          )
          .then((response) => {
            if (response.affectedRows === 0) {
              return resolve({ erro: `Falha ao atualizar os dados da Agenda.` })
            } else {
              return resolve({ mensagem: `Agenda atualizada com sucesso.` })
            }
          })
          .catch((error) => {
            if (error.message.includes(`Duplicate`)) {
              return resolve({ erro: `Agenda já cadastrada.` })
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

  apagar(id_agenda) {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
              UPDATE
                agendas
              SET
                ativo = NOT ativo
              WHERE
                id = ?
            `,
            [id_agenda]
          )
          .then((response) => {
            if (response[0].affectedRows === 0) {
              return resolve({ erro: 'Agenda não encontrada.' })
            } else {
              return resolve({ mensagem: 'Agenda apagada com sucesso.' })
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
}
