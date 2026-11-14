import { Router } from 'express'
import controller from '../controllers/users.js'

const router = Router()

// OWASP Top 10:2025 A01 - Falha no Controle de Acesso:
// todas as rotas abaixo exigem autenticação JWT (middleware auth);
// a única rota pública da API é POST /users/login.

// As rotas de sessão (/login, /me) devem vir ANTES das rotas dinâmicas
// /:id, para impedir que /me seja capturado indevidamente por /:id.
router.post('/login', controller.login)
router.get('/me', controller.me)

router.post('/', controller.create)
router.get('/', controller.retrieveAll)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)
router.get('/:id', controller.retrieveOne)

export default router