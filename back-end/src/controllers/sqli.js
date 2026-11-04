import prisma from '../database/client.js'
import { hashPassword, verifyPassword, isArgon2Hash } from '../utils/security.js'

const controller = {}

controller.login = async function(req, res) {
  const username = req.body?.username ?? ''
  const password = req.body?.password ?? ''

  try {
    const users = await prisma.$queryRaw`
      SELECT id, fullname, username, email, is_admin, password
      FROM "User"
      WHERE username = ${username}
    `

    if(users.length === 0) {
      return res.status(401).send({
        success: false,
        message: 'Login falhou!',
        result: []
      })
    }

    const user = users[0]
    let passwordIsValid = false

    if(isArgon2Hash(user.password)) {
      passwordIsValid = await verifyPassword(user.password, password)
    }
    else {
      passwordIsValid = user.password === password
      if(passwordIsValid) {
        const hashedPassword = await hashPassword(password)
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        })
      }
    }

    if(! passwordIsValid) {
      return res.status(401).send({
        success: false,
        message: 'Login falhou!',
        result: []
      })
    }

    const { password: _, ...safeUser } = user

    res.send({
      success: true,
      message: `Bem-vindo, ${username}!`,
      result: [safeUser]
    })
  }
  catch(error) {
    console.error(error)
    res.status(500).send({
      success: false,
      message: 'Erro no servidor'
    })
  }
}

export default controller
