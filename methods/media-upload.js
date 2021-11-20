import cloudinary from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

export const mediaUpload = (folder) => {
	cloudinary.v2.config({
		cloud_name: process.env.CLOUD_NAME,
		api_key: process.env.API_KEY,
		api_secret: process.env.API_SECRET,
	})

	return new CloudinaryStorage({
		cloudinary: cloudinary.v2,
		params: {
			folder: folder,
		},
	})
}
