import prisma from '../src/database/client.js'
import { hashPassword, isArgon2Hash } from '../src/utils/security.js'

async function main() {
  const users = await prisma.user.findMany()
  let migrated = 0

  for (const user of users) {
    if (isArgon2Hash(user.password)) continue

    const password = await hashPassword(user.password)
    await prisma.user.update({
      where: { id: user.id },
      data: { password }
    })
    migrated++
  }

  console.log(`${migrated} senha(s) migrada(s) para Argon2id.`)
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
