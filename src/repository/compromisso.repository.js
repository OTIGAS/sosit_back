import { db } from '../config/database.js'

export default class AgendaRepository {
  cadastrar(body) {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
            INSERT INTO
              compromissos (
                id_usuario,
                id_horario,
                dt_completa,
                descricao,
                ativo
              )
            VALUES
              (?,?,?,?,1)
          `,
            [
              body?.id_usuario,
              body?.id_horario,
              body?.dt_completa,
              body?.descricao,
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

  buscar(id_compromisso) { // confirmar
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
              SELECT
                c.id_usuario,
                uc.nome as nome_cliente,
                c.id_horario,
                h.inicio h_inicio,
                h.fim h_fim,
                a.nome nome_agenda,
                ue.nome as nome_empresa,
                c.dt_completa,
                c.descricao
              FROM
                compromissos c
              LEFT JOIN 
                usuarios uc ON c.id_usuario = uc.id
              LEFT JOIN 
                horarios h ON c.id_horarios = h.id
              LEFT JOIN
                agendas a ON h.id_agenda = a.id
              LETF JOIN 
                usuarios ue ON a.id_usuario = ue.id
              WHERE
                a.id = ?
                AND a.ativo = 1
            `,
            [id_compromisso]
          )
          .then(([response]) => {
            if (!response?.length) {
              return resolve({ erro: `Compromisso não encontrado.` })
            } else {
              return resolve({ compromisso: response[0] })
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
                c.id_usuario,
                uc.nome as nome_cliente,
                c.id_horario,
                h.inicio h_inicio,
                h.fim h_fim,
                a.nome nome_agenda,
                ue.nome as nome_empresa,
                c.dt_completa,
                c.descricao
              FROM
                compromissos c
              LEFT JOIN 
                usuarios uc ON c.id_usuario = uc.id
              LEFT JOIN 
                horarios h ON c.id_horarios = h.id
              LEFT JOIN
                agendas a ON h.id_agenda = a.id
              LETF JOIN 
                usuarios ue ON a.id_usuario = ue.id
              WHERE
                (
                
                )
                AND c.ativo = 1
            `,
            [`%${procurar}%`, `%${procurar}%`]
          )
          .then(([response]) => {
            return resolve({ compromissos: response })
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
            [body?.nome, body?.servico, body?.descricao, body?.id_compromisso]
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

  apagar(id_compromisso) {
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
            [id_compromisso]
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
