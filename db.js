import pg from 'pg'

const Pool = pg.Pool
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
})

export default pool
