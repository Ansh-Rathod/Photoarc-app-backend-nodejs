import express from 'express'
import asyncHandler from '../../methods/async-function.js'
import pool from '../../db.js'
const router = express.Router()

router.get(
	'/',
	asyncHandler(async (req, res, next) => {
		var data = await pool.query(
			`select * from appusers where LOWER(name) like '%${req.query.q}%'`
		)
		res.status(200).json({
			success: true,
			results: data.rows,
		})
	})
)
router.get(
	'/get_posts',
	asyncHandler(async (req, res, next) => {
		var { rows } = await pool.query(`select * from get_search_posts();`)

		res.status(200).json({
			success: true,
			results: rows.map((row) => {
				return {
					post_id: row.new_post_id,
					post_image_url: row.new_post_image_url,
					caption: row.new_caption,
					user_id: row.new_user_id,
					posted_at: row.new_posted_at,
					likes: row.new_likes,
					username: row.new_username,
					name: row.new_name,
					width: row.new_width,
					height: row.new_height,
					avatar_url: row.new_avatar_url,
				}
			}),
		})
	})
)
// get_search_posts

export default router
