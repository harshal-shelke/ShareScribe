# NoteMate

NoteMate is a web application designed for users to post, edit, delete, like, and view notes. Built with Node.js, Express, MongoDB, and EJS, it offers features like user authentication and post visibility control based on login status. 

## Features

- **User Registration & Login**: Users can # ShareScribe

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
create accounts, log in, and access their personalized notes.
- **Create, Edit, Delete Posts**: Users can add new notes, edit or delete existing ones.
- **Like Posts**: Users can like posts they find interesting.
- **Post Visibility Control**: Only the user who uploaded a post can view and edit it.
- **Responsive Design**: The application is mobile-friendly and adapts to different screen sizes.
- **User Authentication**: Passwords are securely hashed using `bcrypt`.

## Tech Stack

- **Frontend**: EJS, Tailwind CSS 
- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **Version Control**: Git, GitHub

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/harshal-shelke/notemate.git

   cd notemate

   npm install

   DB_URI=your-mongodb-uri

   jwtSecret=your-secret-key

   npm start

