import { Router } from 'express'
import { UserHandler } from '../handlers/user-handler'
import { checkJwt } from '../middlewares/checkJwt'

const router = Router()

router.post('/register', UserHandler.register)
router.post('/login', UserHandler.login)
router.get('/current', checkJwt, UserHandler.current)
router.post('/send-email', checkJwt, UserHandler.sendEmail)

export default router
