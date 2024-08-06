import { Router } from 'express'
import passport from 'passport'
import {
	getCurrentSession,
	registerUser,
	failRegister,
	loginUser,
	failLogin,
	restorePassword,
	sendResetEmail,
	resetPassword,
} from '../controllers/controllersRouter/sessionController.js'

const sessionRouter = Router()

sessionRouter.get(
	'/current',
	passport.authenticate('jwt', { session: false }),
	getCurrentSession,
)
sessionRouter.post(
	'/register',
	passport.authenticate('register', { failureRedirect: '/failregister' }),
	registerUser,
)
sessionRouter.get('/failregister', failRegister)

sessionRouter.post(
	'/login',
	passport.authenticate('login', { failureRedirect: '/faillogin' }),
	loginUser,
)
sessionRouter.get('/faillogin', failLogin)
sessionRouter.get(
	'/github',
	passport.authenticate('github', { scope: ['user:email'] }),
)
sessionRouter.get(
	'/githubcallback',
	passport.authenticate('github', { failureRedirect: '/login' }),
	async (req, res) => {
		req.session.user = req.user
		res.redirect('/')
	},
)
sessionRouter.post('/restore', restorePassword)

sessionRouter.post('/send-reset-email', sendResetEmail)
sessionRouter.post('/reset-password', resetPassword)

export default sessionRouter
