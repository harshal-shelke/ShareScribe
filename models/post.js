const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: String,
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    likes: { type: [mongoose.Schema.Types.ObjectId], ref: 'user', default: [] }, // Initialize likes as an empty array
});

const Post = mongoose.model('post', postSchema);
module.exports = Post;
