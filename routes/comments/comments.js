import express from 'express'
import asyncHandler from '../../methods/async-function.js'
import pool from './../../db.js'
import { v4 as uuidv4 } from 'uuid'

import { buildCrateCommentsQuery, buildGetCommentsQuery } from './sql-querys.js'
const router = express.Router()

function getFullTimestamp() {
	const pad = (n, s = 2) => `${new Array(s).fill(0)}${n}`.slice(-s)
	const d = new Date()

	return `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(
		d.getDate()
	)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(
		d.getMilliseconds(),
		3
	)}`
}

router.post(
	'/create-comment',
	asyncHandler(async (req, res, next) => {
		const body = req.body
		await pool.query(
			`insert into ${body.user_id}comments (commenter_user_id, post_id, comment_created_at , comment,comment_id)
			 values
			  ($1,$2,$3,$4,$5);`,
			[
				body.commenter_user_id,
				body.post_id,
				body.comment_created_at,
				body.comment,
				body.comment_id,
			]
		)
		await pool.query(
			`insert into ${body.user_id}notifications (notification_id,user_id,comment,post_id,_type,follower_id,time_at) values ($1,$2,$3,$4,$5,$6,$7)`,
			[
				uuidv4(),
				body.commenter_user_id,
				body.comment,
				body.post_id,
				'COMMENT',
				body.commenter_user_id,
				getFullTimestamp(),
			]
		)

		res.status(200).json({
			success: true,
			results: [],
		})
	})
)

router.post(
	'/all',
	asyncHandler(async (req, res, next) => {
		var data = await pool.query(buildGetCommentsQuery(req.body))
		res.status(200).json({
			success: true,
			results: data.rows,
		})
	})
)

router.delete(
	'/',
	asyncHandler(async (req, res, next) => {
		await pool.query(
			`DELETE FROM ${req.body.user_id}comments WHERE id = ${req.body.comment_id}`
		)
		res.status(202).json({
			success: true,
			results: [],
		})
	})
)

export default router
