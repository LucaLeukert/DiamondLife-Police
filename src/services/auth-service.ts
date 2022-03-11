import bcrypt from 'bcrypt'

import userRepo from '@repos/user-repo'
import jwtUtil from '@util/jwt-util'
import StatusCodes from 'http-status-codes'

const { UNAUTHORIZED } = StatusCodes

/**
 * Login()
 *
 * @param username
 * @param password
 * @returns
 */
// eslint-disable-next-line max-len
async function login(
	username: string,
	password: string
): Promise<{ jwt?: string; error?: { message: string; code: number } }> {
	// Fetch user
	const user = await userRepo.getOne(username)
	if (!user) {
		return {
			error: {
				message: 'UNAUTHORIZED',
				code: UNAUTHORIZED,
			},
		}
	}

	// Check password
	const pwdPassed = await bcrypt.compare(password, user.pwdHash)
	if (!pwdPassed) {
		return {
			error: {
				message: 'UNAUTHORIZED',
				code: UNAUTHORIZED,
			},
		}
	}
	// Setup Admin Cookie
	return {
		jwt: await jwtUtil.sign({
			id: user.id,
			email: user.username,
			name: user.username,
			role: user.role,
		}),
	}
}

// Export default
export default {
	login,
} as const
