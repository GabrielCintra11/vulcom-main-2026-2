/**
 * Middleware de autenticação JWT.
 *
 * - A única rota pública da API é POST /users/login; todas as demais
 *   exigem um token JWT válido.
 * - O token deve ser enviado no cabeçalho Authorization, no formato
 *   "Authorization: Bearer TOKEN" (compatível com Postman, Insomnia
 *   e EchoAPI).
 * - Tokens ausentes, inválidos ou expirados retornam HTTP 403: Forbidden.
 * - Os dados do usuário autenticado ficam disponíveis nos controllers
 *   em req.authUser.
 */

import jwt from 'jsonwebtoken'

// Rotas públicas que não exigem autenticação.
// ATENÇÃO: POST /users NÃO é público (cadastro de usuários é protegido).
const PUBLIC_ROUTES = [
  { method: 'POST', path: '/users/login' }
]

export default function auth(req, res, next) {

  // Exceção pública: POST /users/login
  if(PUBLIC_ROUTES.some(
    route => req.method === route.method && req.path === route.path
  )) return next()

  // Recupera o token do cabeçalho "Authorization: Bearer TOKEN"
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : undefined

  // Token ausente ~> HTTP 403: Forbidden
  if(! token) return res.status(403).end()

  let payload

  try {
    // OWASP Top 10:2025 A07 - Falhas de Autenticação:
    // o token é validado com o segredo do servidor; tokens assinados
    // com outro segredo, alterados ou expirados são rejeitados.
    payload = jwt.verify(token, process.env.TOKEN_SECRET)
  }
  catch(error) {
    // Token inválido ou expirado ~> HTTP 403: Forbidden
    // (o erro não é logado para não expor o token nos logs)
    return res.status(403).end()
  }

  // Coloca os dados do usuário autenticado à disposição dos controllers
  req.authUser = payload

  next()
}
