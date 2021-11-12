import express from 'express'
import pool from '../../db.js'
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

export default router
