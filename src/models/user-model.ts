export enum UserRoles {
	Standard,
	Admin,
}

export interface IUser {
	id: number
	username: string
	pwdHash: string
	role: UserRoles
}

/**
 * Get a new User object.
 *
 * @param username
 * @param role
 * @param pwdHash
 * @returns
 */
function getNew(username: string, role?: UserRoles, pwdHash?: string): IUser {
	return {
		id: -1,
		username: username,
		role: role ?? UserRoles.Standard,
		pwdHash: pwdHash ?? '',
	}
}

/**
 * Copy a user object.
 *
 * @param user
 * @returns
 */
function copy(user: IUser): IUser {
	return {
		id: user.id,
		username: user.username,
		role: user.role,
		pwdHash: user.pwdHash,
	}
}

// Export default
export default {
	createNewUser: getNew,
	copy,
}
