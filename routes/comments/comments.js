import express from 'express'
import asyncHandler from '../../methods/async-function.js'
import pool from './../../db.js'
import { buildCrateCommentsQuery, buildGetCommentsQuery } from './sql-querys.js'
const router = express.Router()

router.post(
	'/create-comment',
	asyncHandler(async (req, res, next) => {
		await pool.query(buildCrateCommentsQuery(req.body))

		res.status(200).json({
			success: true,
			results: [],
		})
	})
)

router.get(
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
