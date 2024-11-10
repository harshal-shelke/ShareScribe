# NoteMate

NoteMate is a web application designed for users to post, edit, delete, like, and view notes. Built with Node.js, Express, MongoDB, and EJS, it offers features like user authentication and post visibility control based on login status. 

## Features

- **User Registration & Login**: Users can create accounts, log in, and access their personalized notes.
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

