import jwt from 'jsonwebtoken'
import UserManager from '../controllers/userManager.js'
import logger from './logger.js'

const userManager = new UserManager()

export const authenticate = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(' ')[1]
		if (!token) {
			return res.status(401).json({ message: 'No token provided' })
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		const user = await userManager.getUserById(decoded.id)
		if (!user) {
			return res.status(401).json({ message: 'User not found' })
		}

		req.user = user
		next()
	} catch (error) {
		logger.error('Authentication error:', error)
		res.status(500).json({
			msg: `Error interno del servidor en authMiddleware.authenticate: ${error}`,
		})
	}
}

// export const authenticate = (req, res, next) => {
// 	const token = req.headers.authorization?.split(' ')[1]

// 	if (!token) {
// 		return res.status(401).json({ message: 'No token provided' })
// 	}

// 	try {
// 		const decoded = jwt.verify(token, process.env.JWT_SECRET)
// 		req.user = decoded
// 		next()
// 	} catch (error) {
// 		return res.status(401).json({ message: 'Invalid token' })
// 	}
// }
