import argon2 from 'argon2'

export const publicUserSelect = {
  id: true,
  fullname: true,
  username: true,
  email: true,
  is_admin: true
}

const argon2Options = {
  type: argon2.argon2id,
  memoryCost: 66560,
  timeCost: 3,
  parallelism: 4
}

export function hashPassword(password) {
  return argon2.hash(password, argon2Options)
}

export function verifyPassword(hash, password) {
  return argon2.verify(hash, password)
}

export function isArgon2Hash(value) {
  return typeof value === 'string' && value.startsWith('$argon2id$')
}
