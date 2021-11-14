function buildCrateCommentsQuery(body) {}

function buildGetCommentsQuery(body) {
	return `select * from ${body.user_id}comments
    left join appusers ON ${body.user_id}comments.commenter_user_id = appusers.id 
    where post_id = '${body.post_id}';`
}
export { buildCrateCommentsQuery, buildGetCommentsQuery }
