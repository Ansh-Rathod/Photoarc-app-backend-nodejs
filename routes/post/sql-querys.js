function buildCreatePostsQuery(body) {
	return `insert into ${body.user_id}posts
     (post_id,post_image_url,caption,user_id,created_at,likes,comments_count)
      values ('${body.post_id}', '${body.post_image_url}','${body.caption}','${body.user_id}','${body.created_at}',ARRAY ['${body.user_id}'],0);`
}

function buildLikeUpdateQuery(body) {
	return `update ${body.user_id}posts set likes = array_append(likes,'${body.liker_id}') where post_id = '${body.post_id}';`
}
function buildUnlikeUpdateQuery(body) {
	return `update ${body.user_id}posts set likes = array_remove(likes,'${body.liker_id}') where post_id = '${body.post_id}';`
}

function buildInsertinlikesTable(body) {
	return `insert into ${body.user_id}likes (post_id,liker_user_id) values ('${body.post_id}','${body.liker_id}');`
}
function buildDeleteFromlikesTable(body) {
	return `delete from ${body.user_id}likes where post_id = '${body.post_id}' and liker_user_id = '${body.liker_id}';`
}

function buildGetLikesQuery(body) {
	return `select * from ${body.user_id}likes
      left join appusers ON ${body.user_id}likes.liker_user_id = appusers.id 
      where post_id = '${body.post_id}';`
}
function buildGetPostsQuery(user_id) {
	return `select * from ${user_id}posts
      left join appusers ON ${user_id}posts.user_id = appusers.id order by posted_at desc;`
}

export {
	buildCreatePostsQuery,
	buildLikeUpdateQuery,
	buildUnlikeUpdateQuery,
	buildInsertinlikesTable,
	buildDeleteFromlikesTable,
	buildGetLikesQuery,
	buildGetPostsQuery,
}
