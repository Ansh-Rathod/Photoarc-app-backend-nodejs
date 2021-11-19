import pg from 'pg'

const Pool = pg.Pool
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
})

export default pool
