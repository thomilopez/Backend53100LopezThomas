import { errorDictionary } from '../utils.js'

const errorHandler = (err, req, res, next) => {
	const errorMessage = errorDictionary[err.name] || err.message
	const statusCode = err.code || 500

	res.status(statusCode).json({
		status: 'error',
		message: errorMessage,
		description: err.description || 'An unexpected error occurred.',
	})
}

export default errorHandler
