import authService from '@services/auth-service'
import { ParamMissingError } from '@shared/errors'
import { Request, Response, Router } from 'express'
import StatusCodes from 'http-status-codes'

const router = Router()
const { OK } = StatusCodes

export const paths = {
	login: '/login',
	logout: '/logout',
} as const

export const cookieProps = Object.freeze({
	key: 'LSPD-Auth',
	secret: process.env.COOKIE_SECRET,
	options: {
		httpOnly: true,
		signed: true,
		path: process.env.COOKIE_PATH,
		maxAge: Number(process.env.COOKIE_EXP),
		domain: process.env.COOKIE_DOMAIN,
		secure: process.env.SECURE_COOKIE === 'true',
	},
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post(paths.login, async (req: Request, res: Response) => {
	const { username, password } = req.body
	if (!(username && password)) {
		throw new ParamMissingError()
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const { jwt, error } = await authService.login(username, password)

	if (error) {
		return res.status(error.code).json({ error: error.message })
	}

	const { key, options } = cookieProps
	res.cookie(key, jwt, options)
	return res.status(OK).json({ message: 'success' })
})

router.get(paths.logout, (_: Request, res: Response) => {
	const { key, options } = cookieProps

	res.clearCookie(key, options)
	return res.status(OK).json({ message: 'success' })
})

export default router
