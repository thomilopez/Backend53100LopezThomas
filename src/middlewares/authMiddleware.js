import jwt from 'jsonwebtoken'
import UserManager from '../controllers/userManager.js'

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
		console.error('Authentication error:', error)
		res.status(401).json({ message: 'Authentication failed' })
	}
}
