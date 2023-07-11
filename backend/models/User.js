//Import du module mongoose
const mongoose = require("mongoose");
//Import du module mongoose-unique-validator
const uniqueValidator = require("mongoose-unique-validator");

//On crée un schema "userSchema"
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, max: 100, minlength: 6 },
  pseudo: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  bio: { type: String, max: 500 },
  image: { type: String },
  isAdmin: { type: Boolean, default: false },
  isAuthor: { type: Boolean, default: false },
});

//Plugin pour garantir un email unique
userSchema.plugin(uniqueValidator);

// On exporte userSchema
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
