require('dotenv').config();
const express=require('express')
const app=express()
const userModel=require('./models/user')
const cookieParser = require('cookie-parser')
const bcrypt=require('bcrypt')
const postModel = require('./models/post')
const jwt=require('jsonwebtoken')
const upload = require('./config/cloudinaryConfig'); 
const path=require('path')

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(cookieParser())
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,"public")))


const jwtSecret = process.env.JWT_SECRET;

function authenticateUser(req, res, next) {
    const token = req.cookies.token;
    
    if (token) {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            req.user = decoded;
        } catch (err) {
            console.error("Invalid token:", err);
            req.user = null;
        }
    } else {
        req.user = null;
    }
    
    next();
}

app.use(authenticateUser);

// Apply authenticateUser as a middleware for all routes that need req.user
app.use(authenticateUser);


app.get('/',(req,res)=>{
    res.redirect('posts')
})

app.get('/createAccount',(req,res)=>{
    res.render('index',{ errorMessage: null })
})


// Import the upload configuration that uses Cloudinaryis path based on where you saved the Cloudinary config
app.post('/register', upload.single('image'), async (req, res) => {
    try {
        // Server-side validation for required fields
        const { username, name, email, password, age } = req.body;
        const image = req.file.path;
        // console.log(image);

        let errorMessage = '';
        
        if (!username || !name || !email || !password || !age || !image) {
            errorMessage = 'All fields are required, including the image.';
            return res.render('index', { errorMessage });
        }

        // Replace spaces in the username with underscores
        const formattedUsername = username.replace(/\s+/g, '_');

        if (!/^[\w]+$/.test(formattedUsername)) {
            errorMessage = 'Username can only contain letters, numbers, and underscores.';
            return res.render('index', { errorMessage });
        }

        // Check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errorMessage = 'Please provide a valid email address.';
            return res.render('index', { errorMessage });
        }

        // Check if age is a valid number
        if (isNaN(age) || age <= 0) {
            errorMessage = 'Please provide a valid age.';
            return res.render('index', { errorMessage });
        }

        // Check if user already exists in the database
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            errorMessage = 'User already exists with this email address.';
            return res.render('index', { errorMessage });
        }

        // Hash the password before saving
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                errorMessage = 'Error hashing password.';
                return res.render('index', { errorMessage });
            }

            // Save user to the database
            const profilePic =image;
            const newUser = new userModel({
                username: formattedUsername, // Use the formatted username
                name,
                email,
                password: hash,
                age,
                profilePic
            });

            await newUser.save();

            // Create JWT token
            const token = jwt.sign({ email: newUser.email, userid: newUser._id }, jwtSecret);
            res.cookie('token', token).redirect('/');
        });
    } catch (error) {
        console.error(error);
        return res.render('index', { errorMessage: 'Error registering user, please try again later.' });
    }
});




app.get('/login', (req, res) => {
    // Render the login page without any error initially
    res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });

    if (!user) {
        // If user doesn't exist, pass the error to the login page
        return res.render('login', { error: "Invalid credentials" });
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = jwt.sign({ email: user.email, userid: user._id }, jwtSecret);
            res.cookie('token', token, { httpOnly: true, secure: false });
            res.status(200).redirect("/posts");
        } else {
            // If password doesn't match, pass the error to the login page
            return res.render('login', { error: "Invalid credentials" });
        }
    });
});



app.get('/logout',(req,res)=>{
    res.cookie('token',"")
    res.redirect('/posts')
})

app.get('/posts', async (req, res) => {
    try {
        // Fetch all posts, populate 'user' to get post author details, and sort by the number of likes in descending order
        const posts = await postModel.find().populate('user')
        let user = null; // Default for guests
        if (req.user) {
            // Retrieve the logged-in user’s details from the database
            user = await userModel.findById(req.user.userid);
        }
        
        posts.sort((a, b) => b.likes.length - a.likes.length);
        // Pass posts and user to the view (user will be null for guests)
        res.render('posts', { posts, user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching posts');
    }
});


app.get('/profile', isLoggedIn, async (req, res) => {
    let user = await userModel
        .findOne({ email: req.user.email })
        .populate('posts');  // Ensure posts are populated

    // Sort posts by number of likes in descending order
    user.posts.sort((a, b) => b.likes.length - a.likes.length);

    res.render('profile', { user });
});

app.get('/like/:id', isLoggedIn, async (req, res) => {
    try {
        let post = await postModel.findOne({ _id: req.params.id }).populate('user');

        // Check if the user has already liked the post
        if (post.likes.indexOf(req.user.userid) === -1) {
            post.likes.push(req.user.userid);
        } else {
            post.likes.splice(post.likes.indexOf(req.user.userid), 1);
        }

        await post.save();

        // Redirect to posts page after like/unlike action
        res.redirect('/posts');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error liking/unliking post');
    }
});

app.get('/edit/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id}).populate('user');

    res.render('edit',{post})
});

app.get('/delete/:id', async (req, res) => {
    let post=await postModel.findOneAndDelete({_id:req.params.id})
    res.redirect('/userPosts')
})


app.post('/update/:id',isLoggedIn,async (req, res) => {
    let post=await postModel.findOneAndUpdate({_id:req.params.id},{content:req.body.content})
    res.redirect('/profile')
})

app.post('/post', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });

    // Create new post
    let post = await postModel.create({
        user: user._id,
        content: req.body.content
    });

    // Push the created post's ID to the user's posts array
    user.posts.push(post._id);
    await user.save();

    res.redirect('/userPosts');
});



function isLoggedIn(req, res, next) {
    if (!req.cookies.token) {
        return res.redirect('/login');
    }

    try {
        const data = jwt.verify(req.cookies.token, jwtSecret)
        req.user = data; // Set user information from JWT to req.user
        next();
    } catch (err) {
        res.redirect('/login');
    }
}

app.get('/userPosts',isLoggedIn,async(req, res) =>{
    let user = await userModel
        .findOne({ email: req.user.email })
        .populate('posts');  // Ensure posts are populated

    // Sort posts by number of likes in descending order
    user.posts.sort((a, b) => b.likes.length - a.likes.length);
    res.render('userPosts',{user})
})


app.get('/profileUpload',(req,res)=>{
    res.render('profileUpload')
})

app.post('/upload',isLoggedIn,upload.single("image"),async(req,res)=>{
    let user=await userModel.findOne({email:req.user.email})
    
    user.profilePic=req.file.path
    await user.save()
    res.redirect('/profile')

})




const port =process.env.PORT || 5000;  // Default to 5000 if PORT is not set

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
