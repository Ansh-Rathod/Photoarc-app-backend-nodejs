import express from 'express'
import asyncHandler from '../../methods/async-function.js'
import { mediaUpload } from '../../methods/media-upload.js'
import multer from 'multer'
import cloudinary from 'cloudinary'
import pool from '../../db.js'

import { v4 as uuidv4 } from 'uuid'
import formidable from 'formidable'
const { IncomingForm } = formidable

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
router.use(express.json())
const upload = multer({ storage: mediaUpload('posts') })

router.put(
	'/upload-post',
	asyncHandler(async (req, res, next) => {
		const data = await new Promise((resolve, reject) => {
			const form = new IncomingForm()
			form.parse(req, (err, fields, files) => {
				if (err) return reject(err)
				resolve({ fields, files })
			})
		})
		console.log(data.files.picture.filepath)
		var result = await cloudinary.v2.uploader.upload(
			data.files.picture.filepath,
			{
				folder: 'POSTS',
			}
		)

		res.status(202).json({
			success: true,
			url: result.url,
			data: result,
		})
	})
)

router.post(
	'/create-post',
	asyncHandler(async (req, res, next) => {
		const body = req.body
		await pool.query(
			`insert into ${body.user_id}posts
			(post_id,post_image_url,caption,user_id,posted_at,likes,comments_count,width,height)
			 values ($1, $2,$3,$4,$5,'{}',0,$6,$7);`,
			[
				body.post_id,
				body.post_image_url,
				body.caption,
				body.user_id,
				body.created_at,
				body.width,
				body.height,
			]
		)
		await pool.query(
			`update appusers set posts_count=posts_count + 1 where id ='${body.user_id}' `
		)
		res.status(202).json({
			success: true,
			results: [],
		})
	})
)

router.put(
	'/like',
	asyncHandler(async (req, res, next) => {
		const body = req.body

		await pool.query(buildLikeUpdateQuery(req.body))
		await pool.query(buildInsertinlikesTable(req.body))
		await pool.query(`UPDATE ${req.body.user_id}posts
		SET    likes = ARRAY (
						 SELECT v
						 FROM   unnest(likes) WITH ORDINALITY t(v,ord)
						 GROUP  BY 1
						 ORDER  BY min(ord)
						)
		WHERE  cardinality(likes) > 1  -- optional
		AND    likes <> ARRAY (
						 SELECT v
						 FROM   unnest(likes) WITH ORDINALITY t(v,ord)
						 GROUP  BY 1
						 ORDER  BY min(ord)
						);`)
		if (body.liker_id !== body.user_id) {
			await pool.query(
				`insert into ${body.user_id}notifications (notification_id,user_id,comment,post_id,_type,follower_id,time_at) values ($1,$2,$3,$4,$5,$6,$7)`,
				[
					uuidv4(),
					body.liker_id,
					'',
					body.post_id,
					'LIKE',
					body.liker_id,
					body.time_at,
				]
			)
		}
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

router.post(
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
	'/one_post/:id',
	asyncHandler(async (req, res, next) => {
		const { id } = req.params
		const { post_id } = req.query
		const { rows } = await pool.query(`
		select * from ${id}posts
		left join appusers on ${id}posts.user_id = appusers.id where post_id ='${post_id}';
		`)

		res.status(200).json({
			success: true,
			results: rows,
		})
	})
)
router.get(
	'/:user_id',
	asyncHandler(async (req, res, next) => {
		var data = await pool.query(buildGetPostsQuery(req.params.user_id))
		res.status(200).json({
			success: true,
			results: data.rows.map((row) => {
				return {
					post_id: row.post_id,
					post_image_url: row.post_image_url,
					caption: row.caption,
					user_id: row.user_id,
					posted_at: row.posted_at,
					likes: row.likes,
					username: row.username,
					name: row.name,
					avatar_url: row.avatar_url,
					width: row.width,
					height: row.height,
				}
			}),
		})
	})
)
router.delete(
	'/:id',
	asyncHandler(async (req, res, next) => {
		const { id } = req.params
		const { post_id } = req.query
		await pool.query(`delete from ${id}likes where post_id = '${post_id}'`)
		await pool.query(
			`delete from ${id}notifications where post_id = '${post_id}'`
		)
		await pool.query(`delete from ${id}comments where post_id = '${post_id}'`)
		await pool.query(`delete from ${id}posts where post_id = '${post_id}'`)
		await pool.query(
			`update appusers set posts_count=posts_count - 1 where id ='${id}' `
		)
		res.status(200).json({
			success: true,
			results: [],
		})
	})
)

export default router
