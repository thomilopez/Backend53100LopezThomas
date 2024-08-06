import { Router } from 'express'
import passport from 'passport'
import {
	getAllUsers,
	changeUserRole,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
	loginUser,
	logoutUser,
	getCurrentUser,
	updateToPremium,
	uploadDocuments,
	deleteInactiveUsers,
} from '../controllers/controllersRouter/userController.js'
import AuthorizationMiddleware from '../middlewares/authorizationMiddleware.js'
import upload from '../middlewares/multerConfig.js'

const userRouter = Router()

// Ruta para obtener la lista de usuarios (solo accesible para administradores)
userRouter.get(
	'/users',
	passport.authenticate('jwt', { session: false }),
	AuthorizationMiddleware.isAdmin,
	getAllUsers,
)

userRouter.delete(
	'/',
	passport.authenticate('jwt', { session: false }),
	AuthorizationMiddleware.isAdmin,
	deleteInactiveUsers,
)

// Ruta para obtener un usuario por su ID
userRouter.get(
	'/user/:id',
	passport.authenticate('jwt', { session: false }),
	AuthorizationMiddleware.isUserOrAdmin,
	getUserById,
)

// Ruta para crear un nuevo usuario
userRouter.post('/user', createUser)

// Ruta para actualizar un usuario (solo accesible para el usuario o administradores)
userRouter.patch(
	'/user/:id',
	passport.authenticate('jwt', { session: false }),
	AuthorizationMiddleware.isUserOrAdmin,
	updateUser,
)

// Ruta para cambiar el rol de un usuario (solo accesible para administradores)
userRouter.patch(
	'/users/premium/:id',
	passport.authenticate('jwt', { session: false }),
	AuthorizationMiddleware.isAdmin,
	changeUserRole,
)

userRouter.patch('/user/:id/premium', updateToPremium)

userRouter.post(
	'/user/:id/documents',
	upload.fields([
		{ name: 'profileImage', maxCount: 1 },
		{ name: 'productImage', maxCount: 1 },
		{ name: 'document', maxCount: 10 },
	]),
	uploadDocuments,
)

// Ruta para eliminar un usuario (solo accesible para administradores)
userRouter.delete(
	'/user/:id',
	passport.authenticate('jwt', { session: false }),
	AuthorizationMiddleware.isAdmin,
	deleteUser,
)

// Ruta para iniciar sesión
userRouter.post('/login', loginUser)

// Ruta para cerrar sesión
userRouter.post('/logout', logoutUser)

// Ruta para obtener la información del usuario actual
userRouter.get(
	'/current',
	passport.authenticate('jwt', { session: false }),
	getCurrentUser,
)

export default userRouter
