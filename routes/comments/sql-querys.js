import mysql_real_escape_string from './../../utils/to-query-function.js'
function buildCrateCommentsQuery(body) {
	var comment = mysql_real_escape_string(body.comment)
	return `insert into ${body.user_id}comments (commenter_user_id,post_id,created_at,comment) values ('${body.commenter_user_id}','${body.post_id}','${body.created_at}','${comment}');`
}

function buildGetCommentsQuery(body) {
	return `select * from ${body.user_id}comments
    left join appusers ON ${body.user_id}comments.commenter_user_id = appusers.id 
    where post_id = '${body.post_id}';`
}
export { buildCrateCommentsQuery, buildGetCommentsQuery }
