import express from 'express'
import asyncHandler from '../../methods/async-function.js'
import { mediaUpload } from '../../methods/media-upload.js'
import multer from 'multer'
import pool from '../../db.js'
import {
	buildCreatePostsQuery,
	buildLikeUpdateQuery,
	buildUnlikeUpdateQuery,
	buildInsertinlikesTable,
	buildGetLikesQuery,
	buildDeleteFromlikesTable,
	buildGetPostsQuery,
} from './sql-querys.js'

const router = express.Router()
const upload = multer({ storage: mediaUpload('posts') })

router.put(
	'/upload-post',
	upload.single('picture'),
	asyncHandler(async (req, res, next) => {
		res.status(202).json({
			success: true,
			results: req.file,
		})
	})
)

router.post(
	'/create-post',
	asyncHandler(async (req, res, next) => {
		await pool.query(buildCreatePostsQuery(req.body))
		res.status(202).json({
			success: true,
			results: [],
		})
	})
)

router.put(
	'/like',
	asyncHandler(async (req, res, next) => {
		await pool.query(buildLikeUpdateQuery(req.body))
		await pool.query(buildInsertinlikesTable(req.body))
		res.status(202).json({
			success: true,
			results: [],
		})
	})
)

router.put(
	'/unlike',
	asyncHandler(async (req, res, next) => {
		await pool.query(buildUnlikeUpdateQuery(req.body))
		await pool.query(buildDeleteFromlikesTable(req.body))
		res.status(202).json({
			success: true,
			results: [],
		})
	})
)
router.get(
	'/likes',
	asyncHandler(async (req, res, next) => {
		var data = await pool.query(buildGetLikesQuery(req.body))
		res.status(200).json({
			success: true,
			results: data.rows,
		})
	})
)

router.get(
	'/:user_id',
	asyncHandler(async (req, res, next) => {
		var data = await pool.query(buildGetPostsQuery(req.params.user_id))
		res.status(200).json({
			success: true,
			results: data.rows,
		})
	})
)

export default router
