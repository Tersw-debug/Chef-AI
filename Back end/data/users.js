const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: v => /^(\+?\d{10,15})$/.test(v),
      message: props => `${props.value} is not a valid phone number`
    }
  },
  password: {
    type: String,
    required: true
  },
   roles: {
    User: {
      type: Number,
      default: 100258
    },
    Admin: Number
  },
  refreshToken: String
});

userSchema.pre('validate', function() {
    const bannedUsers = ['root', 'admin', 'superuser'];
    if(bannedUsers.includes(this.username.toLowerCase()))
    {
        this.invalidate('username', 'that username is not allowed');
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
