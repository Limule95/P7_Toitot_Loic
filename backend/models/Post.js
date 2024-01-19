//Import du module mongoose
const mongoose = require("mongoose");
const { stringify } = require("querystring");

//On crée un schema "postSchema"
const postSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  pseudo: { type: String, required: true },
  message: { type: String, required: true, maxlength: 500 },
  image: { type: String },
  rate: { type: [Number], default: null },
  moyenne: { type: Number, default: null },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

// On exporte postSchema
const postModel = mongoose.model("post", postSchema);
module.exports = postModel;
