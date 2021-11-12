import express from 'express'
import errorHandler from './middlewares/error.js'
import createUser from './routes/user/user.js'
import followuser from './routes/events/events.js'
import createPost from './routes/post/create-post.js'
import comment from './routes/comments/comments.js'
import search from './routes/search/search.js'

const app = express()

app.use(express.json())

app.use('/api/v1/user/', createUser)
app.use('/api/v1/user/events', followuser)
app.use('/api/v1/post/', createPost)
app.use('/api/v1/post/comments', comment)
app.use('/api/v1/search', search)
app.use(errorHandler)

app.listen(3000, console.log('Server running on port 3000'))
