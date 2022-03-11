import StatusCodes from 'http-status-codes'
import { Request, Response, NextFunction } from 'express'

import { UserRoles } from '@models/user-model'
import { cookieProps } from '@routes/auth-router'
import jwtUtil from '@util/jwt-util'

// Constants
const { UNAUTHORIZED } = StatusCodes
const jwtNotPresentErr = 'JWT not present in signed cookie.'

/**
 * Middleware to verify if user is an admin.
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function checkAdminPermissions(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const jwt = req.signedCookies[cookieProps.key]
		if (!jwt) {
			throw Error(jwtNotPresentErr)
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const clientData = await jwtUtil.decode(jwt)
		if (
			typeof clientData === 'object' &&
			clientData.role === UserRoles.Admin
		) {
			res.locals.sessionUser = clientData
			next()
		} else {
			throw Error(jwtNotPresentErr)
		}
	} catch (err) {
		return res.status(UNAUTHORIZED).json({
			error: err.message,
		})
	}
}
