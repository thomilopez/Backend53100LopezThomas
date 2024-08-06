import multer from 'multer'
import path from 'node:path'

const getDestination = (fieldname) => {
	const destinations = {
		profileImage: 'src/public/uploads/profiles',
		productImage: 'src/public/uploads/products',
		document: 'src/public/uploads/documents',
	}
	return destinations[fieldname] || '../public/uploads/others'
}

// Configuración de Multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		try {
			cb(null, getDestination(file.fieldname))
		} catch (error) {
			cb(error)
		}
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname))
	},
})

const upload = multer({ storage })

export const uploadDocuments = upload.fields([
	{ name: 'profileImage', maxCount: 1 },
	{ name: 'productImage', maxCount: 1 },
	{ name: 'document', maxCount: 10 },
])

export default upload
