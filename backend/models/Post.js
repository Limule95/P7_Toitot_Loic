//Import du module mongoose
const mongoose = require("mongoose");

//On crée un schema "postSchema"
const postSchema = mongoose.Schema({
  userId: { type: String, required: true },
  pseudo: { type: String, required: true },
  message: { type: String, required: true, maxlength: 500 },
  image: { type: String },
  likers: { type: [String] },
});

// On exporte postSchema
const postModel = mongoose.model("post", postSchema);
module.exports = postModel;
