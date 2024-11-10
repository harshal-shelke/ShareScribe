const mongoose = require("mongoose");
require('dotenv').config();

const dbUri = process.env.DB_URI;

mongoose.connect(dbUri);

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  age: Number,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
});

module.exports = mongoose.model("user", userSchema);
