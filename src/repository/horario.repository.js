import { db } from '../config/database.js'

export default class HorarioRepository {
  cadastrar(body) {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
            INSERT INTO
              horarios (
                id_dia,
                id_agenda,
                inicio,
                fim,
                ativo
              )
            VALUES
              (?,?,?,?,1)
          `,
            [
              body?.id_dia,
              body?.id_agenda,
              body?.inicio,
              body?.fim
            ]
          )
          .then(([response]) => {
            if (response?.affectedRows === 0) {
              return resolve({ erro: `Falha na inclusão do horário` })
            } else {
              return resolve({ mensagem: `Horário cadastrado com sucesso.` })
            }
          })
          .catch((error) => {
            if (error?.message?.includes(`Duplicate`)) {
              return resolve({ erro: `Horário já cadastrada.` })
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

  buscar(id_horario) {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
              SELECT
                h.id
                h.id_dia,
                ds.dia
                h.id_agenda,
                a.nome
                h.inicio,
                h.fim
              FROM
                horarios h
              LEFT JOIN 
                dia_semana ds ON h.id_dia = ds.id
              LEFT JOIN
                agendas a ON h.id_agenda = a.id
              WHERE
                h.id = ?
                AND h.ativo = 1
            `,
            [id_horario]
          )
          .then(([response]) => {
            if (!response?.length) {
              return resolve({ erro: `Horário não encontrado.` })
            } else {
              return resolve({ horario: response[0] })
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
                h.id
                h.id_dia,
                ds.dia
                h.id_agenda,
                a.nome
                h.inicio,
                h.fim
              FROM
                horarios h
              LEFT JOIN 
                dia_semana ds ON h.id_dia = ds.id
              LEFT JOIN
                agendas a ON h.id_agenda = a.id
              WHERE
                (
                  h.id_dia = ?
                  OR h.id_agenda = ?
                )
                AND h.ativo = 1
            `,
            [procurar, procurar]
          )
          .then(([response]) => {
            return resolve({ horarios: response })
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

  atualizar(id_horario) {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
              UPDATE
                horarios
              SET
                ativo = NOT ativo
              WHERE
                id = ?
            `,
            [id_horario]
          )
          .then((response) => {
            if (response[0].affectedRows === 0) {
              return resolve({ erro: 'Horário não encontrada.' })
            } else {
              return resolve({ mensagem: 'Horário atualizado com sucesso.' })
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

  apagar(id_horario) {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
              DELETE FROM
                horarios
              WHERE
                id = ?
            `,
            [id_horario]
          )
          .then((response) => {
            if (response[0].affectedRows === 0) {
              return resolve({ erro: 'Horário não encontrado.' })
            } else {
              return resolve({ mensagem: 'Horário apagado com sucesso.' })
            }
          })
          .catch((error) => {
            if (error?.message?.includes(`foreign key`)) {
              return resolve({ erro: `Horário associado a outra informação.` })
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
