import express from 'express'
import pool from './../../db.js'
import asyncHandler from '../../methods/async-function.js'
const router = express.Router()

router.get(
	'/:id',
	asyncHandler(async (req, res, next) => {
		const { id } = req.params
		const { rows } = await pool.query(
			`select * from ${id}notifications left join appusers
             on ${id}notifications.follower_id = appusers.id;`
		)
		res.status(200).json({
			success: true,
			results: rows,
		})
	})
)

export default router
