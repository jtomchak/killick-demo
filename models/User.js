const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true
    },
    bio: String,
    image: String,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    hash: String,
    salt: String
  },
  {
    timestamps: true,
    usePushEach: true
  }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });

//validate user password
UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
  return this.hash === hash;
};

//vaild user payload when auth'd
UserSchema.methods.toAuthJSON = function() {
  return {
    username: this.username,
    email: this.email,
    bio: this.bio,
    image: this.image || "https://static.productionready.io/images/smiley-cyrus.jpg",
    token: this.generateJWT()
  };
};

//Pre Save Method!
UserSchema.pre("save", function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
  user.password = hash;
  next();
});

//Create JWT for User
UserSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id, //--> User's unique _id from mongo
      username: this.username, //--> User's username
      exp: parseInt(exp.getTime() / 1000)
    },
    process.env.SUPER_JERK // --> already loaded from .env shhhhhhhh!
  );
};

mongoose.model("User", UserSchema);
