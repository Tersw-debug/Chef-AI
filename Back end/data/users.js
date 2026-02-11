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
  resetPasswordToken: String,
  resetPasswordExpires: Date,
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

userSchema.methods.getResetPasswordToken = function() {
    // 1. Generate the raw token
    const token = crypto.randomBytes(32).toString('hex');

    // 2. Hash it and store it in the database
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest('hex');

    // 3. Set the expiration (30 minutes from now)
    this.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);

    // 4. Return the raw token to be sent in the email
    return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
