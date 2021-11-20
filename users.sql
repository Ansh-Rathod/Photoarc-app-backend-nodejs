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

