export interface IUsers {
	_id: string
	name: string
	email: string
	password: string
	active: boolean
	roleId: string
	createdAt: Date
	updatedAt: Date
	deletedAt: Date
}
