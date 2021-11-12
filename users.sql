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
CREATE TABLE comments(
    commenter_user_id varchar(255) NOT NULL,
    post_id varchar(255) NOT NULL,
    comment TEXT NOT NULL,
    FOREIGN KEY (commenter_user_id) REFERENCES appusers(id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id)
)
UPDATE appusers
SET avatar_url = 'Alfred Schmidt', 
WHERE id = 1;