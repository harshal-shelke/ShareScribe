# ShareScribe

ShareScribe is a thought-posting web application built using Node.js, Express, MongoDB, and EJS. The platform allows users to create accounts, log in, post thoughts, like posts, and manage their profiles. Posts are sorted by popularity, and users can view and edit their own posts through a dedicated profile page.

## Features

- **User Registration and Login**: Secure authentication using JWTs and bcrypt for password hashing.
- **Post Creation and Interaction**: Users can create, edit, and delete posts. Liking functionality enables users to engage with content.
- **Profile Management**: Users can update their profile picture and manage their posts.
- **Image Uploads**: Profile picture and post image uploads are managed with multer and stored via Cloudinary (requires configuration).
- **Authentication Middleware**: Routes are secured with middleware that ensures user authentication.
  
## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: EJS, Tailwind CSS (via CDN)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, bcrypt
- **Image Uploads**: Multer, Cloudinary
- **Miscellaneous**: dotenv, cookie-parser, path for server configuration and security.
