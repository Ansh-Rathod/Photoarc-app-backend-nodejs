import express from 'express'
import pool from '../../db.js'
import { v4 as uuidv4 } from 'uuid'
import asyncHandler from '../../methods/async-function.js'

import {
	buildFollowUserQuery,
	buildFollowingUserQuery,
	buildUnfollowUserQuery,
	buildUnfollowingUserQuery,
	buildUpdateFollowerCountQuery,
	buildUpdateFollowingCountQuery,
	buildUpdateUnfollowCountQuery,
	buildUpdateUnfollowingCountQuery,
} from './sql-querys.js'

const router = express.Router()

router.put(
	'/follow',
	asyncHandler(async (req, res, next) => {
		await pool.query(buildFollowUserQuery(req.body))
		await pool.query(buildFollowingUserQuery(req.body))
		await pool.query(buildUpdateFollowerCountQuery(req.body))
		await pool.query(buildUpdateFollowingCountQuery(req.body))
		await pool.query(
			`insert into ${req.body.user_id}notifications (notification_id,user_id,comment,post_id,_type,follower_id,time_at) values ($1,$2,$3,$4,$5,$6,$7)`,
			[uuidv4(), '', '', '', 'FOLLOW', req.body.follower_id, req.body.time_at]
		)
		res.status(200).json({
			success: true,
		})
	})
)
router.put(
	'/unfollow',
	asyncHandler(async (req, res, next) => {
		await pool.query(buildUnfollowUserQuery(req.body))
		await pool.query(buildUnfollowingUserQuery(req.body))
		await pool.query(buildUpdateUnfollowCountQuery(req.body))
		await pool.query(buildUpdateUnfollowingCountQuery(req.body))
		res.status(200).json({
			success: true,
		})
	})
)
router.get(
	'/isfollow',
	asyncHandler(async (req, res, next) => {
		const { userId, following } = req.query
		const { rows } = await pool.query(
			`SELECT * FROM ${userId}following WHERE following_id = $1`,
			[following]
		)
		res.status(200).json({
			success: true,
			isFollow: rows.length > 0,
		})
	})
)

export default router
