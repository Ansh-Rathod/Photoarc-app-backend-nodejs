# PHOTOARC APP BACKEND

This is the Backend of the Photoarc app. You need to follow some steps to work on this API.

- Clone this repository to your local machine.
- Remove "engines": { "node": "17.x" } line in package.json file.
- create a new .env file in root of your folder.
- Go to [Cloudinary](https://cloudinary.com/pricing) and choose first sign up for free or whatever you want.
  Basically, Cloudinary is a platform where we are going to store our posts and profile images.
  - follow this step to complete cloudinary setup.
  - fill the sign-up form and you will receive an email. complete further steps.
  - now go to the dashboard and copy your **Cloud Name**, **API Key,** and **API Secret**.
  - and paste into your .env file.

```docker
DATABASE_URL=<Postgres SQL connection string>,
CLOUD_NAME=<Cloud Name>,
API_KEY=<API Key>,
API_SECRET=<API Secret>
```

Now open up a terminal and install some node packages with the below command.

```docker
npm install
```

connect your pshell to your database and run following query

- frist create an appusers table by running this query to your pshell.
  ```sql
   CREATE TABLE appusers (
    id varchar(255) NOT NULL UNIQUE PRIMARY KEY,
    username varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    bio TEXT,
    avatar_url varchar(255),
    url varchar(255),
    followers_count INTEGER NOT NULL,
    following_count INTEGER NOT NULL,
    posts_count INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL
  );
  ```

* run this one to create an sql function to get user feed posts.

  ```sql
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
         new_avatar_url varchar,
         new_width int,
         new_height int
     )
     language plpgsql
   as $$
   declare
   var_r record;

  begin
    for var_r in
       execute 'SELECT * FROM '|| _tbl
    loop return query execute 'select post_id,post_image_url,caption,user_id,posted_at,likes,username,name,avatar_url,width,height from ' || quote_ident(var_r.following_id)||'posts
        left join appusers ON '|| quote_ident(var_r.following_id) ||'posts.user_id = appusers.id order by posted_at desc limit 5;';

     end loop;

  end;$$
  ```

* run another query to get trending posts

  ```sql
  create or replace function get_search_posts()
     returns table (
         new_post_id varchar,
         new_post_image_url text,
         new_caption text,
         new_user_id varchar,
         new_posted_at timestamp,
         new_likes text[],
         new_username varchar,
         new_name varchar,
         new_avatar_url varchar,
         new_width integer,
         new_height integer
     )
     language plpgsql
   as $$
   declare
   var_r record;

  begin
    for var_r in
       execute 'SELECT * FROM appusers order by created_at desc limit 100;'
    loop return query execute 'select post_id,post_image_url,caption,user_id,posted_at,likes,username,name,avatar_url,width,height from ' || quote_ident(var_r.id)||'posts
        left join appusers ON '|| quote_ident(var_r.id) ||'posts.user_id = appusers.id order by posted_at desc limit 5;';

     end loop;

   end;$$
  ```

Now you can test this API on your [localhost](http://localhost):300/api/v1/ by running following command.

```docker
npm run dev
```

Documentation link [Photoarc Backend API (getpostman.com)](https://documenter.getpostman.com/view/15632620/UVJWpfGk)
