const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true, maxlength: 500 },
  userId: { type: String, required: true }, // ID de l'utilisateur qui a commenté
  postId: { type: String, required: true }, // ID de la publication associée
  timestamp: { type: Number, required: true },
});

const commentModel = mongoose.model("Comment", commentSchema);
module.exports = commentModel;
