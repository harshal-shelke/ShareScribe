const express=require('express')
const app=express()
const userModel=require('./models/user')
const cookieParser = require('cookie-parser')
const bcrypt=require('bcrypt')
const postModel = require('./models/post')
const jwt=require('jsonwebtoken')

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(cookieParser())
app.set('view engine', 'ejs')

function authenticateUser(req, res, next) {
    const token = req.cookies.token;
    
    if (token) {
        try {
            const decoded = jwt.verify(token, "harshal");
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
    res.render('index')
})

app.post('/register',async (req,res)=>{
    let {username,name,email,password,age} = req.body
    let user=await userModel.findOne({email})
    if(user)return res.status(500).send("user already exists")
    
    bcrypt.hash(password,10,async(err,hash)=>{
        let genUser=await userModel.create({
            username,
            name,
            email,
            password:hash,
            age
        })

        let token=jwt.sign({email:genUser.email, userid:genUser._id},"harshal")
        res.cookie('token',token).redirect('/')
    })
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login',async (req,res)=>{
    let {email,password} = req.body
    let user=await userModel.findOne({email})
    if(!user)return res.status(401).send("Invalid credentials")

    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            let token=jwt.sign({email:user.email, userid:user._id},"harshal")
            res.cookie('token',token,{ httpOnly: true, secure: false })
            res.status(200).redirect("/posts")
        } 
        else res.redirect('/login')
    })
})

app.get('/logout',(req,res)=>{
    res.cookie('token',"")
    res.redirect('/login')
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
    res.redirect('/profile')
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

    res.redirect('/profile');
});



function isLoggedIn(req, res, next) {
    if (!req.cookies.token) {
        return res.redirect('/login');
    }

    try {
        const data = jwt.verify(req.cookies.token, "harshal");
        req.user = data; // Set user information from JWT to req.user
        next();
    } catch (err) {
        res.redirect('/login');
    }
}


const port=5000;


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})