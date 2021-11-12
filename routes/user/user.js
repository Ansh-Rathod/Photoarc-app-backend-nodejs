import express from 'express'
import pool from '../../db.js'
import asyncHandler from '../../methods/async-function.js'
import { mediaUpload } from '../../methods/media-upload.js'
import multer from 'multer'
import {
	buildCreateUserQuery,
	buildUserFollowersQuery,
	buildUserFollowingQuery,
	buildUserPostsQuery,
	buildUserLikesQuery,
	buildUserCommentsQuery,
	buildUpdateAvatarQuery,
	buildGetUserInfoQuery,
	buildDeleteUserInfoQuery,
	buildDeleteUserFollowersQuery,
	buildDeleteUserFollowingQuery,
	buildDeleteUserPostsQuery,
	buildDeleteUserLikesQuery,
	buildDeleteUserCommentsQuery,
	buildUpdateUserInfoQuery,
} from './sql-querys.js'

const router = express.Router()

router.post(
	'/create-user',
	asyncHandler(async (req, res, next) => {
		if (
			req.body.id === undefined &&
			req.body.name === undefined &&
			req.body.username === undefined &&
			req.body.bio === undefined &&
			req.body.url === undefined &&
			req.body.avatar_url === undefined &&
			req.body.created_at === undefined
		) {
			return res
				.status(400)
				.json({ success: false, error: 'Please provide all feilds.' })
		}
		var data = await pool.query(buildCreateUserQuery(req.body))
		await pool.query(buildUserFollowersQuery(req.body))
		await pool.query(buildUserFollowingQuery(req.body))
		await pool.query(buildUserPostsQuery(req.body))
		await pool.query(buildUserLikesQuery(req.body))
		await pool.query(buildUserCommentsQuery(req.body))
		res.status(202).json({ success: true, results: data.rows })
	})
)

const upload = multer({ storage: mediaUpload('profile') })

router.put(
	'/upload-profile/:id',
	upload.single('picture'),
	asyncHandler(async (req, res, next) => {
		if (req.params.id === undefined) {
			return res.status(400).json({
				success: false,
				error: 'Please provide id of user in parameter.',
			})
		}
		await pool.query(buildUpdateAvatarQuery(req.params.id, req.file.path))
		res.status(202).json({
			success: true,
			results: [],
		})
	})
)

router.get(
	'/:id',
	asyncHandler(async (req, res, next) => {
		if (req.params.id === undefined) {
			return res.status(400).json({
				success: false,
				error: 'Please provide id of user in parameter.',
			})
		}
		var data = await pool.query(buildGetUserInfoQuery(req.params.id))
		if (data.rows.length === 0) {
			return res.status(404).json({
				success: false,
				error: 'User not found.',
			})
		}
		res.status(200).json({
			success: true,
			results: data.rows,
		})
	})
)

router.delete(
	'/:id',
	asyncHandler(async (req, res, next) => {
		await pool.query(buildDeleteUserInfoQuery(req.params.id))
		await pool.query(buildDeleteUserFollowersQuery(req.params))
		await pool.query(buildDeleteUserFollowingQuery(req.params))
		await pool.query(buildDeleteUserLikesQuery(req.params))
		await pool.query(buildDeleteUserCommentsQuery(req.params))
		await pool.query(buildDeleteUserPostsQuery(req.params))
		res.status(202).json({
			success: true,
			results: [],
		})
	})
)

router.put(
	'/:id',
	asyncHandler(async (req, res, next) => {
		await pool.query(buildUpdateUserInfoQuery(req.body))
		res.status(202).json({
			success: true,
			results: [],
		})
	})
)

export default router
