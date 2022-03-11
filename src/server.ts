import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import path from 'path'
import helmet from 'helmet'
import StatusCodes, { UNAUTHORIZED } from 'http-status-codes'
import express, { NextFunction, Request, Response } from 'express'
import { engine } from 'express-handlebars'

import 'express-async-errors'

import BaseRouter from './routes/api'
import logger from 'jet-logger'
import { cookieProps } from '@routes/auth-router'
import { CustomError } from '@shared/errors'
import { checkAdminPermissions } from '@routes/middleware'
import jwtUtil from '@util/jwt-util'
import { IUser } from '@models/user-model'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(cookieProps.secret))

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.engine('hbs', engine({ extname: '.hbs' }))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

if (process.env.NODE_ENV === 'production') {
	app.use(helmet())
}

app.use('/api', BaseRouter)

app.use(
	(err: Error | CustomError, _: Request, res: Response, __: NextFunction) => {
		logger.err(err, true)
		const status =
			err instanceof CustomError
				? err.HttpStatus
				: StatusCodes.BAD_REQUEST
		return res.status(status).json({
			error: err.message,
		})
	}
)

const viewsDir = path.join(__dirname, 'views')
app.set('views.hbs', viewsDir)

const staticDir = path.join(__dirname, 'public')
app.use(express.static(staticDir))

app.get('/', (_: Request, res: Response) => {
	res.render('homepage')
})

app.get('/faq', (_: Request, res: Response) => {
	res.render('faq')
})

app.get('/question', (_: Request, res: Response) => {
	res.render('question')
})

app.get(
	'/dashboard',
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	checkAdminPermissions,
	async (req: Request, res: Response) => {
		const jwt = req.signedCookies[cookieProps.key]
		if (!jwt) {
			res.status(UNAUTHORIZED).send('UNAUTHORIZED')
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const user = (await jwtUtil.decode(jwt)) as IUser

		res.render('dashboard', { user })
	}
)

export default app
