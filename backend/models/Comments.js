const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true, maxlength: 500 },
})

const commentModel = mongoose.model("commentSchema", commentSchema);
module.exports = commentModel;