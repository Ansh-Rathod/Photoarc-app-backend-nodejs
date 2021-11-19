import express from 'express'
import pool from '../../db.js'
import asyncHandler from '../../methods/async-function.js'
import { mediaUpload } from '../../methods/media-upload.js'
import multer from 'multer'
import {
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
	buildNotificationTableQuery,
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
		const body = req.body
		var data = await pool.query(
			'insert into appusers (id, username, name, bio, url, avatar_url, created_at, followers_count, following_count, posts_count) values ($1, $2, $3, $4, $5, $6,$7,$8, $9, $10)',
			[
				body.id,
				body.username,
				body.name,
				body.bio,
				body.url,
				body.avatar_url,
				body.created_at,
				0,
				0,
				0,
			]
		)
		await pool.query(buildUserFollowersQuery(req.body))
		await pool.query(buildUserFollowingQuery(req.body))
		await pool.query(buildUserPostsQuery(req.body))
		await pool.query(buildUserLikesQuery(req.body))
		await pool.query(buildUserCommentsQuery(req.body))
		await pool.query(buildNotificationTableQuery(req.body))
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
		const body = req.body
		await pool.query(
			`update appusers set username = $1, name = $2, bio = $3, url = $4 where id = '${body.id}'`,
			[body.username, body.name, body.bio, body.url]
		)
		res.status(202).json({
			success: true,
			results: [],
		})
	})
)

router.get(
	'/followers/:id',
	asyncHandler(async (req, res, next) => {
		const { id } = req.params
		const { rows } = await pool.query(`select * from ${id}followers 
	left join appusers on ${id}followers.follower_id = appusers.id;`)
		res.status(200).json({
			success: true,
			results: rows,
		})
	})
)

router.get(
	'/following/:id',
	asyncHandler(async (req, res, next) => {
		const { id } = req.params
		const { rows } = await pool.query(`select * from ${id}following
	left join appusers on ${id}following.following_id = appusers.id;`)
		res.status(200).json({
			success: true,
			results: rows,
		})
	})
)

export default router
