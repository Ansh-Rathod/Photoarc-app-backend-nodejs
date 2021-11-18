CREATE TABLE USERS(
    id varchar(255) NOT NULL UNIQUE PRIMARY KEY,
    username varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    bio TEXT,
    avatar_url varchar(255),
    url varchar(255),
    followers_count INTEGER NOT NULL,
    following_count INTEGER NOT NULL,
    posts_count INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
)

INSERT INTO USERS(id, username, name, bio, avatar_url, url, followers_count, following_count, posts_count, created_at)
VALUES ('uuid-v4***********','ansh22020','Ansh Rathod','flutter developer','https://source.unsplash.com/','https:ansh-rathod-blog.gmail.com',12,34,12,'2019-01-01 00:00:00')
SELECT * FROM Users;


CREATE TABLE posts (
    post_id varchar(255) NOT NULL UNIQUE,
    post_image_url TEXT,
    caption TEXT,
    user_id varchar(255) ,
    created_at TIMESTAMP NOT NULL,
    likes_count INT NOT NULL,
    comments_count INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES appusers(id)
)

INSERT INTO posts (id, image, caption, user_id, created_at) VALUES ('1', 'test', 'test', '1', '2019-01-01 00:00:00');

SELECT * FROM posts;

SELECT * FROM posts LEFT JOIN Users ON posts.user_id = Users.id;

CREATE TABLE followers (
    follower_id varchar(255) NOT NULL UNIQUE,
    FOREIGN KEY (follower_id) REFERENCES USERS(id)
)

CREATE TABLE likes(
    liker_user_id varchar(255) NOT NULL,
    post_id varchar(255) NOT NULL,
    FOREIGN KEY (liker_user_id) REFERENCES appusers(id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id)

)


create or replace function get_feed(
    _tbl regclass
) 
     returns table (
         new_post_id varchar,
         new_post_image_url text,
         new_caption text,
         new_user_id varchar,
         new_posted_at timestamp,
         new_likes text[],
         new_username varchar,
         new_name varchar,
new_width int,
         new_height int,
         new_avatar_url varchar
     )
     language plpgsql
as $$
declare
var_r record;

begin 
    for var_r in 
       execute 'SELECT * FROM '|| _tbl
    loop return query execute 'select post_id,post_image_url,caption,user_id,posted_at,likes,username,name,avatar_url from ' || quote_ident(var_r.following_id)||'posts
        left join appusers ON '|| quote_ident(var_r.following_id) ||'posts.user_id = appusers.id order by posted_at desc limit 5;';

     end loop;

end;$$




create or replace function get_search_posts(
    
) 
     returns table (
         new_post_id varchar,
         new_post_image_url text,
         new_caption text,
         new_user_id varchar,
         new_posted_at timestamp,
         new_likes text[],
         new_username varchar,
         new_name varchar,
         new_width int,
         new_height int,
         new_avatar_url varchar
     )
     language plpgsql
as $$
declare
var_r record;

begin 
    for var_r in 
       execute 'SELECT * FROM appusers order by created_at desc limit 100;'
    loop return query execute 'select post_id,post_image_url,caption,user_id,posted_at,likes,username,name,avatar_url from ' || quote_ident(var_r.id)||'posts
        left join appusers ON '|| quote_ident(var_r.id) ||'posts.user_id = appusers.id order by posted_at desc limit 5;';

     end loop;

end;$$


CREATE OR REPLACE FUNCTION follow_user()
RETURNS INTEGER as $$

CREATE TABLE notifications (
    id varchar(255) NOT NULL UNIQUE,
    user_id varchar(255) NOT NULL,
    comment TEXT,
    post_id varchar(255) NOT NULL,
    _type varchar(255) NOT NULL,
    follower_id varchar(255) NOT NULL,
    time_at TIMESTAMP NOT NULL,
)

notification_id,
_user_id,
_comment,
_post_id,
post_image_url
_type,
follower_id,
time_at,
follower_avatar_url,
follower_id,
folloer_name,
follower_username