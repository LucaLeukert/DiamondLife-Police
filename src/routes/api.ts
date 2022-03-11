import { Router } from 'express'
import { checkAdminPermissions } from './middleware'
import authRouter from './auth-router'
import userRouter from './user-router'

// Init
const apiRouter = Router()

// Add api routes
apiRouter.use('/auth', authRouter)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
apiRouter.use('/users', checkAdminPermissions, userRouter)

// Export default
export default apiRouter
