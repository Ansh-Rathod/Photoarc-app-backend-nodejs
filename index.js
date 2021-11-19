import express from 'express'
import errorHandler from './middlewares/error.js'
import createUser from './routes/user/user.js'
import followuser from './routes/events/events.js'
import createPost from './routes/post/create-post.js'
import comment from './routes/comments/comments.js'
import search from './routes/search/search.js'
import feed from './routes/feed/get-user-feed.js'
import notifications from './routes/notifications/get-notifications.js'
import dotenv from 'dotenv'
import cors from 'cors'
import xss from 'xss-clean'
import helmet from 'helmet'

const app = express()
dotenv.config({ path: './.env' })
app.options('*', cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/user/', createUser)
app.use('/api/v1/user/events', followuser)
app.use('/api/v1/post/', createPost)
app.use('/api/v1/post/comments', comment)
app.use('/api/v1/search', search)
app.use('/api/v1/feed', feed)
app.use('/api/v1/notifications', notifications)
app.use(errorHandler)

app.use(helmet())
app.use(xss())
const PORT = process.env.PORT || 3000
app.listen(PORT, console.log('Server running on port 3000'))
