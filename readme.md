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
CLOUD_NAME=<**Cloud Name>**,
API_KEY=<**API Key**>,
API_SECRET=<**API Secret**>
```

Now open up a terminal and install some node packages with the below command.

```docker
npm install
```

Now you can test this API on your [localhost](http://localhost):300/api/v1/ by running following command.

```docker
npm run dev
```

Documentation link [Photoarc Backend API (getpostman.com)](https://documenter.getpostman.com/view/15632620/UVJWpfGk)
