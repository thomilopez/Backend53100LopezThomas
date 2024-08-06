import { Router } from 'express'
import auth from '../middlewares/auth.js'
import { generateMockingProducts } from '../utils.js'
import AuthManager from '../controllers/authManager.js'
import AuthorizationMiddleware from '../middlewares/authorizationMiddleware.js'

const authManager = new AuthManager()
const router = Router()

router.get('/register', (req, res) => {
	res.render('register')
})

router.get('/login', (req, res) => {
	res.render('login')
})

router.get('/', auth, (req, res) => {
	res.render('profile', {
		user: req.session.user,
	})
})
//restaurar password
router.get('/restore', (req, res) => {
	res.render('restore')
})

router.get('/realtimeproducts', (req, res) => {
	res.render('realTimeProducts')
})

router.get('/chat', (req, res) => {
	res.render('chat')
})

router.get('/mockingproduct', async (req, res) => {
	const products = generateMockingProducts()
	res.send({ status: 'success', payload: products })
})

router.get('/loggertest', (req, res) => {
	req.logger.debug('Este es un mensaje de depuración')
	req.logger.http('Este es un mensaje http')
	req.logger.info('Este es un mensaje informativo')
	req.logger.warn('Este es un mensaje de advertencia')
	req.logger.error('Este es un mensaje de error')
	req.logger.fatal('Este es un mensaje fatal')

	res.send('Logs enviados con éxito')
})

// Rutas para la gestión de usuarios
router.get(
	'/admin/users',
	auth,
	AuthorizationMiddleware.isAdmin,
	(req, res) => {
		res.render('adminUsers')
	},
)
router.get('/products', auth, (req, res) => {
	res.render('products')
})

// Rutas para el carrito de compras
router.get('/cart', auth, (req, res) => {
	res.render('cart')
})

router.get('/checkout', auth, (req, res) => {
	res.render('checkout')
})

router.get('/confirmation', auth, (req, res) => {
	res.render('confirmation')
})

// Ruta para mostrar la vista de solicitud de restablecimiento de contraseña
router.get('/request-password-reset', (req, res) => {
	res.render('requestPasswordReset')
})

// Ruta para enviar el correo de restablecimiento de contraseña
router.post('/request-password-reset', async (req, res) => {
	try {
		const { email } = req.body
		const result = await authManager.sendResetEmail(email)

		if (result === 'Correo de restablecimiento enviado') {
			res.render('requestPasswordResetSuccess')
		} else {
			res.render('requestPasswordResetError', { error: result })
		}
	} catch (error) {
		console.error(
			'Error al enviar el correo de restablecimiento de contraseña:',
			error,
		)
		res.status(500).send('Error interno al procesar la solicitud')
	}
})

// Ruta para mostrar la vista de restablecimiento de contraseña
router.get('/reset-password', async (req, res) => {
	try {
		const token = req.query.token
		const isValidToken = await authManager.validateResetToken(token)

		if (!isValidToken) {
			return res.render('resetPasswordExpired')
		}

		res.render('resetPasswordForm', { token })
	} catch (error) {
		console.error('Error al procesar el token de restablecimiento:', error)
		res.status(500).send('Error interno al procesar la solicitud')
	}
})

// Ruta para procesar el formulario de restablecimiento de contraseña
router.post('/reset-password', async (req, res) => {
	try {
		const { token, newPassword } = req.body
		const result = await authManager.resetPassword(token, newPassword)
		if (!result) return res.render('resetPasswordError', { error: result })
		return res.render('resetPasswordSuccess')
	} catch (error) {
		console.error('Error al procesar el restablecimiento de contraseña:', error)
		res.status(500).send('Error interno al procesar la solicitud')
	}
})

export default router
