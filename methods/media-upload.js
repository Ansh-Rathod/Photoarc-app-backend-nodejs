import cloudinary from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

export const mediaUpload = (folder) => {
	cloudinary.v2.config({
		cloud_name: 'dornu6mmy',
		api_key: '459913161249364',
		api_secret: '9z9buL0YNMYG1aB8w4wh8gaP-3s',
	})

	return new CloudinaryStorage({
		cloudinary: cloudinary.v2,
		params: {
			folder: folder,
		},
	})
}
