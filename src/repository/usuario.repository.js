import { db } from '../config/database.js'

import { ConfigGenereteToken } from '../config/jsonwebtoken.js'
import { UtilCheckHash, UtilGenerateHash } from '../utils/cryptography.js'

export default class UsuarioRepository {
  entrar(body) {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
              SELECT
                id,
                nome,
                email,
                senha,
                perfil,
                ativo
              FROM
                usuarios
              WHERE
                email = ?
            `,
            [body?.email]
          )
          .then(async ([response]) => {
            if (!response?.length) {
              return resolve({ erro: `E-mail ou/e Senha inválidos.` })
            } else if (!response[0]?.ativo) {
              return resolve({ erro: `Cadastro do usuário expirado.` })
            } else {
              const { id, nome, email, perfil, ativo, senha } = response[0]
              const token = await ConfigGenereteToken({ id })
              const usuario_autenticado = await UtilCheckHash(body?.senha, senha)
              if (usuario_autenticado) {
                return resolve({
                  token,
                  usuario: { nome, email, perfil, ativo },
                  mensagem: `Bem-vindo, ${nome.split(' ')[0]}!`,
                })
              } else {
                return resolve({ erro: `E-mail e/ou Senha inválidos.` })
              }
            }
          })
          .catch((error) => {
            console.error(error)
            return reject(new Error(error))
          })
          .finally(() => {
            conn.end()
          })
      })
    })
  }

  cadastrar(body) {
    return new Promise((resolve, reject) => {
      return UtilGenerateHash(body?.senha).then((senha) => {
        db().then((conn) => {
          return conn
            .query(
              `
                INSERT INTO
                  usuarios (
                    nome,
                    email,
                    senha,
                    perfil,
                    ativo
                  )
                VALUES
                  (?,?,?,?,1)
              `,
              [body?.nome, body?.email, senha, body?.perfil]
            )
            .then(([response]) => {
              if (response?.affectedRows === 0) {
                return resolve({ erro: `Falha na inclusão do Usuário.` })
              } else {
                return resolve({ mensagem: `Usuário cadastrado.` })
              }
            })
            .catch((error) => {
              if (error?.message?.includes(`Duplicate`)) {
                return resolve({ erro: `E-mail já cadastrado.` })
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
    })
  }

  buscar(id_usuario) {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
              SELECT
                u.id,
                u.nome,
                u.email,
                u.perfil,
                u.ativo
              FROM
                usuarios u
              WHERE
                u.id = ?
            `,
            [id_usuario]
          )
          .then(([response]) => {
            if (!response?.length) {
              return resolve({ erro: `Usuário não encontrado.` })
            } else if (response?.ativo == 0) {
              return resolve({ erro: `Cadastro do usuário expirado.` })
            } else {
              return resolve({ usuario: response[0] })
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
                u.id,
                u.nome,
                u.email,
                u.perfil,
                u.ativo
              FROM
                usuarios u
              WHERE
                (
                  u.nome LIKE ?
                  OR u.email LIKE ?
                  OR u.perfil LIKE ?
                )
                AND u.ativo = 1
            `,
            [`%${procurar}%`, `%${procurar}%`, `%${procurar}%`]
          )
          .then(([response]) => {
            if (!response.length) {
              return resolve({ erro: `Nenhum usuário encontrado.` })
            } else {
              return resolve({ usuarios: response })
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

  atualizar(id_usuario, body) {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
              UPDATE
                usuarios
              SET
                nome = ?,
                email = ?,
                perfil = ?
              WHERE
                id = ?
          `,
            [body?.nome, body?.email, body?.perfil, id_usuario]
          )
          .then((response) => {
            if (response.affectedRows === 0) {
              return resolve({ erro: `Falha ao atualizar os dados do Usuário.` })
            } else {
              return resolve({ mensagem: `Usuário atualizado com sucesso.` })
            }
          })
          .catch((error) => {
            if (error.message.includes(`Duplicate`)) {
              return resolve({ erro: `E-mail já cadastrado.` })
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

  atualizarSenha(body) {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
              SELECT
                id,
                senha,
                ativo
              FROM
                usuarios
              WHERE
                email = ?
            `,
            [body?.email]
          )
          .then(async ([response]) => {
            if (!response?.length) {
              return resolve({ erro: `Falha ao atualizar a senha do Usuário.` })
            } else if (!response[0]?.ativo) {
              return resolve({ erro: `Cadastro do usuário expirado.` })
            } else {
              const autenticado = await UtilCheckHash(body?.senha_antiga, response[0]?.senha)
              if (autenticado) {
                return UtilGenerateHash(body?.senha_nova).then((senha) => {
                  db().then((conn) => {
                    return conn
                      .query(
                        `
                          UPDATE
                            usuarios
                          SET
                            senha = ?
                          WHERE
                            email = ?
                        `,
                        [senha, body?.email]
                      )
                      .then(([response]) => {
                        console.log(response)
                        if (response.affectedRows === 0) {
                          return resolve({ erro: `Falha ao atualizar a senha do Usuário.` })
                        } else {
                          return resolve({ mensagem: `Senha atualizar com sucesso.` })
                        }
                      })
                      .catch((error) => {
                        return reject(new Error(error))
                      })
                  })
                })
              } else {
                return resolve({ erro: `Senha inválida.` })
              }
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

  atualizarStatus(id_usuario) {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
              UPDATE
                usuarios
              SET
                ativo = NOT ativo
              WHERE
                id = ?
            `,
            [id_usuario]
          )
          .then((response) => {
            if (response.affectedRows === 0) {
              return resolve({ erro: `Falha ao atualizar o status.` })
            } else {
              return resolve({ mensagem: `Status atualizados com sucesso.` })
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

  apagar(id_usuario) {
    return new Promise((resolve, reject) => {
      db().then((conn) => {
        return conn
          .query(
            `
              DELETE FROM
                usuarios
              WHERE
                id = ?
            `,
            [id_usuario]
          )
          .then((response) => {
            if (response[0].affectedRows === 0) {
            } else {
              return resolve({ mensagem: 'Usuário apagado com sucesso.' })
            }
          })
          .catch((error) => {
            if (error?.message?.includes(`foreign key`)) {
              return conn
                .query(
                  `
                    UPDATE
                      usuarios
                    SET
                      ativo = NOT ativo
                    WHERE
                      id = ?
                  `,
                  [id_usuario]
                )
                .then((response) => {
                  if (response[0].affectedRows === 0) {
                    return resolve({ erro: 'Usuário não encontrado.' })
                  } else {
                    return resolve({ mensagem: 'Usuário apagado com sucesso.' })
                  }
                })
                .catch((error) => {
                  console.log(error)
                  return reject(new Error(error))
                })
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
