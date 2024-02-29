const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User should enter the name"],
    maxLength: 30,
    minLength: 4,
  },
  email: {
    type: String,
    unique: true, // Assuming emails should be unique
  },
  password: {
    type: String,
    required: [true, "User should enter the password"],
    minLength: [8, "Password should have at least 8 characters"],
  },
  confirmpassword: {
    type: String,
    validate: {
      validator: function (value) {
        // Assuming that the confirmpassword should match the password
        return this.password === value;
      },
      message: "Passwords do not match",
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

module.exports = mongoose.model("User", userSchema);