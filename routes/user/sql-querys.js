function buildUserFollowersQuery(body) {
	return `CREATE TABLE ${body.id}followers (
        follower_id varchar(255) NOT NULL UNIQUE,
        FOREIGN KEY (follower_id) REFERENCES appusers(id)
    );`
}
function buildUserFollowingQuery(body) {
	return `CREATE TABLE ${body.id}following (
        following_id varchar(255) NOT NULL UNIQUE,
        FOREIGN KEY (following_id) REFERENCES appusers(id)
    );`
}
function buildUserPostsQuery(body) {
	return `
    CREATE TABLE ${body.id}posts (
        post_id varchar(255) NOT NULL UNIQUE,
        post_image_url TEXT,
        width INT NOT NULL,
        height INT NOT NULL,
        caption TEXT,
        user_id varchar(255) ,
        posted_at TIMESTAMP NOT NULL,
        likes TEXT [],
        comments_count INT NOT NULL,    
        FOREIGN KEY (user_id) REFERENCES appusers(id)
    );`
}

function buildUserLikesQuery(body) {
	return `
    CREATE TABLE ${body.id}likes(
        liker_user_id varchar(255) NOT NULL,
        post_id varchar(255) NOT NULL,
        FOREIGN KEY (liker_user_id) REFERENCES appusers(id),
        FOREIGN KEY (post_id) REFERENCES ${body.id}posts(post_id)
    
    );
    `
}

function buildUserCommentsQuery(body) {
	return `
    CREATE TABLE ${body.id}comments(
        commenter_user_id varchar(255) NOT NULL,
        post_id varchar(255) NOT NULL,
        comment TEXT NOT NULL,
		comment_created_at TIMESTAMP NOT NULL,
		comment_id varchar(255) NOT NULL UNIQUE,
        FOREIGN KEY (commenter_user_id) REFERENCES appusers(id),
        FOREIGN KEY (post_id) REFERENCES ${body.id}posts(post_id)
    );`
}

function buildUpdateAvatarQuery(id, file) {
	return `update appusers set avatar_url = '${file}' where id = '${id}';`
}

function buildGetUserInfoQuery(id) {
	return `select * from appusers where id = '${id}'`
}

function buildDeleteUserInfoQuery(id) {
	return `delete from appusers where id = '${id}'`
}
function buildDeleteUserFollowersQuery(body) {
	return `drop table ${body.id}followers;`
}
function buildDeleteUserFollowingQuery(body) {
	return `drop table ${body.id}following;`
}
function buildDeleteUserPostsQuery(body) {
	return `drop table ${body.id}posts;`
}
function buildDeleteUserLikesQuery(body) {
	return `drop table ${body.id}likes;`
}
function buildDeleteUserCommentsQuery(body) {
	return `drop table ${body.id}comments;`
}

function buildUpdateUserInfoQuery(body) {
	return `update appusers set username = '${body.username}', name = '${body.name}', bio = '${body.bio}', url = '${body.url}' where id = '${body.id}'`
}
function buildNotificationTableQuery(body) {
	return `CREATE TABLE ${body.id}notifications (
        notification_id varchar(255) NOT NULL UNIQUE,
        user_id varchar(255) NOT NULL,
        comment TEXT,
        post_id varchar(255) NOT NULL,
        _type varchar(255) NOT NULL,
        follower_id varchar(255) NOT NULL,
        time_at TIMESTAMP NOT NULL
    );`
}

export {
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
	buildUpdateUserInfoQuery,
	buildDeleteUserCommentsQuery,
	buildNotificationTableQuery,
}
