import StatusCodes, { BAD_REQUEST } from 'http-status-codes'
import { Request, Response, Router } from 'express'

import userService from '@services/user-service'
import { ParamMissingError } from '@shared/errors'
import { IUser, UserRoles } from '@models/user-model'
import { getRandomInt } from '@shared/functions'
import bcrypt from 'bcrypt'
import userRepo from '@repos/user-repo'

// Constants
const router = Router()
const { CREATED, OK } = StatusCodes

// Paths
export const paths = {
	get: '/all',
	add: '/add',
	update: '/update',
	delete: '/delete/:id',
} as const

/**
 * Get all users.
 */
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get(paths.get, async (_: Request, res: Response) => {
	const users = await userService.getAll()
	return res.status(OK).json({ users })
})

/**
 * Add one user.
 */
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post(paths.add, async (req: Request, res: Response) => {
	const { username, password, roleID } = req.body

	if (!(username && password && roleID)) {
		throw new ParamMissingError()
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	if (await userRepo.getOne(username)) {
		return res
			.status(400)
			.json({ error: 'Username is all ready existing!' })
	}

	const newUser: IUser = {
		id: getRandomInt(),
		username: username,
		pwdHash: await bcrypt.hash(String(password), await bcrypt.genSalt()),
		role: 1,
	}

	await userService.addOne(newUser)
	return res.status(CREATED).json(newUser)
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put(paths.update, async (req: Request, res: Response) => {
	const { userID, username, password, roleID } = req.body

	if (!(username && password && roleID)) {
		throw new ParamMissingError()
	}

	const newUser: IUser = {
		id: userID,
		username: username,
		pwdHash: await bcrypt.hash(String(password), await bcrypt.genSalt()),
		role: 1,
	}

	await userService.updateOne(newUser)
	return res.status(OK).end()
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.delete(paths.delete, async (req: Request, res: Response) => {
	const { id } = req.params

	if (!id) {
		throw new ParamMissingError()
	}
	// Fetch data
	await userService.delete(Number(id))
	return res.status(OK).end()
})

// Export default
export default router
