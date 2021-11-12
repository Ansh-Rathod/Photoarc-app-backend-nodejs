import pg from 'pg'

const Pool = pg.Pool
const pool = new Pool({
	database: 'social_media_app',
	host: 'postgresql-57672-0.cloudclusters.net',
	port: 12356,
	user: 'ansh',
	password: 'ansh0000',
})

export default pool
