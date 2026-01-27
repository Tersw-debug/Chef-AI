const mongoose = require("mongoose");
const crypto = require('crypto');

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
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpiration: Date,
  refreshTokens: {
    type: [String],
    default: []
  }
});

userSchema.pre('validate', function() {
    const bannedUsers = ['root', 'admin', 'superuser'];
    if(bannedUsers.includes(this.username.toLowerCase()))
    {
        this.invalidate('username', 'that username is not allowed');
    }
});

userSchema.methods.getVerifyToken = function() {
  const token = crypto.randomBytes(20).toString('hex');
  
  this.verificationToken = crypto.createHash('sha256').update(token).digest('hex');

  this.verificationTokenExpiration = new Date(Date.now() + 30 * 60 * 1000);

  return token;

}

const User = mongoose.model('User', userSchema);

module.exports = User;
