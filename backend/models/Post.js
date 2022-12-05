//Import du module mongoose
const mongoose = require("mongoose");

//On crée un schema "postSchema"
const postSchema = mongoose.Schema({
  userId: { type: String, required: true },
  author: {type: String, required: true},
  pseudo: { type: String, required: true },
  message: { type: String, required: true, maxlength: 500 },
  image: { type: String },
  // rate est un array de toutes les valeurs selectionnées par les users
  rate: {type: [Number]},
});

// On exporte postSchema
const postModel = mongoose.model("post", postSchema);
module.exports = postModel;
