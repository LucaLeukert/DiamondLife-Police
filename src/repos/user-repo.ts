import { IUser } from '@models/user-model'
import orm from './mock-orm'

/**
 * Get one user.
 *
 * @param username
 * @returns
 */
async function getOne(username: string): Promise<IUser | null> {
	const db = await orm.openDb()
	for (const user of db.users) {
		if (user.username === username) {
			return user as IUser
		}
	}
	return null
}

/**
 * See if a user with the given id exists.
 *
 * @param id
 */
async function persists(id: number): Promise<boolean> {
	const db = await orm.openDb()
	for (const user of db.users) {
		if (Number(user.id) === Number(id)) {
			return true
		}
	}
	return false
}

/**
 * Get all users.
 *
 * @returns
 */
async function getAll(): Promise<IUser[]> {
	const db = await orm.openDb()
	return db.users as Promise<IUser[]>
}

/**
 * Add one user.
 *
 * @param user
 * @returns
 */
async function add(user: IUser): Promise<void> {
	const db = await orm.openDb()
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	db.users.push(user)
	return orm.saveDb(db)
}

/**
 * Update a user.
 *
 * @param user
 * @returns
 */
async function update(user: IUser): Promise<void> {
	const db = await orm.openDb()
	for (let i = 0; i < db.users.length; i++) {
		if (db.users[i].id === user.id) {
			db.users[i] = user
			return orm.saveDb(db)
		}
	}
}

/**
 * Delete one user.
 *
 * @param id
 * @returns
 */
async function deleteOne(id: number): Promise<void> {
	const db = await orm.openDb()
	for (let i = 0; i < db.users.length; i++) {
		if (db.users[i].id === id) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			db.users.splice(i, 1)
			return orm.saveDb(db)
		}
	}
}

// Export default
export default {
	getOne,
	persists,
	getAll,
	add,
	update,
	delete: deleteOne,
} as const
