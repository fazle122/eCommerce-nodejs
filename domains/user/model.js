import mongoose from "mongoose";
import brcypt from "bcryptjs";
import crypto from "crypto";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
    },
    slug: {
      type: String,
      // unique:true,
      // required:true
    },
    images: [
      {
        id: String,
        url: String,
      },
    ],
    brand: {
      type: String,
      required: [true, "brand name is required"],
    },
    category: {
      type: String,
      required: [true, "category is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your name"],
    },
    email: {
      type: String,
      required: [true, "please enter email address"],
      unique: true,
    },
    password: {
      type: String,
      // required:true,
      minLength: [6, "please provide password with 6 character at least"],
    },
    favourite: [productSchema],
    googleId: {
      type: String,
      default: null,
    },
    googleImage: {
      type: String,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await brcypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  console.log("generating has token", this.resetPasswordToken);

  return resetToken;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await brcypt.genSalt(10);
  this.password = await brcypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
export default User;
