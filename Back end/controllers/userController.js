const bcrypt = require('bcrypt');
const User = require('./../data/users');
const User_List = require('./../config/roles');
const sendEmail = require('../middleware/sendEmail');
const crypto = require('crypto')

const handleNewUser = async (req, res) => {
    const {username, email, phone, pwd} = req.body;
    if(!username || !email || !phone || !pwd) return res.status(400).json({
         message: 'username, password, email and phone are required'
    });
    const duplicate = await User.findOne({
    $or: [{ username : username }, { email:email }]});
    if(duplicate) return res.sendStatus(409); //Conflict
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pwd,salt);

        const newUser = new User({
            username:username,
            email:email,
            phone:phone,
            password:hash,
            roles: {User: User_List.User},
            isVerified: false
        });
        const verificationToken = newUser.getVerifyToken();
        
        const result = await newUser.save();

        const verificationURL = `${req.protocol}://${req.get('host')}/verifyemail/${verificationToken}`

        let message = `${verificationURL}`

        await sendEmail({
            email:email,
            subject:"Email Verification",
            message:message
        });

        res.status(201).json({ message: `New user ${username} created successfully but email needs to be Verified.`});
    }
    catch (err) {
        console.error(err)
    }
};


const handleReVerification = async (req, res) => {
    const {email} = req.body;

    if(!email){
        return res.status(400).json({message: "Please type your email."});
    }

    const foundUser = await User.findOne({email:email});
    if(!foundUser) return res.sendStatus(404);
    if(foundUser.isVerified) return res.status(409).json({message: `Email is already verified`});
    try{
        const verificationToken = foundUser.getVerifyToken();
        const result = await foundUser.save();
        const verificationURL = `
                    <p>Please verify your email by clicking the button below:</p>
                            <a href="${req.protocol}://${req.get('host')}/verifyemail/${verificationToken}" 
                                style="padding:10px 15px;background:#007bff;color:white;text-decoration:none;border-radius:5px;">
                                Verify Email
                            </a>
        `
        
        await sendEmail({
            email:email,
            subject:"Email Verification",
            message:verificationURL
        });

        res.status(201).json({ message: `Verification message has sent successfully.`});
    }catch(err){
        console.log(err);
    }
}

const handleUserUpdate = async (req, res) => {
    if (!req.UserInfo) return res.sendStatus(401);

    const { username, email, phone, pwd } = req.body;

    if (!username || !email || !phone)
        return res.status(400).json({
            message: 'username, email and phone are required'
        });

    try {
        const update = { username, email, phone };

        if (pwd) {
            const hash = await bcrypt.hash(pwd, 10);
            update.password = hash;
        }

        await User.findByIdAndUpdate(
            req.UserInfo.id,
            update
        );

        res.status(200).json({
            message: 'Your data has been updated successfully.'
        });

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

const handleGetUser = async (req, res) => {
    if (!req.UserInfo) return res.sendStatus(401);

    try {
        const foundUser = await User.findById(req.UserInfo.id)
            .select('username email phone'); // no password

        if (!foundUser) return res.sendStatus(404);

        res.status(200).json(foundUser);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

const handleLogout = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;
    try{

        const foundUser = await User.findOne({refreshTokens: refreshToken});
    
        if(foundUser)
        {
            foundUser.refreshTokens = foundUser.refreshTokens.filter(rt => rt !== refreshToken);
            await foundUser.save();

        }
        
        res.clearCookie('jwt', {
            httpOnly:true,
            sameSite:'Lax',
            secure:false
        });

        res.sendStatus(204);
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Server error during email verification'
        });
    }
}


const handleResetPassword = async (req, res) => {
    const {email} = req.body;

    if(!email){
        return res.status(400).json({message: "Please type your email."});
    }

    const foundUser = await User.findOne({email:email});
    if (!foundUser) {
        return res.json({
            message: "If the email exists, a reset link was sent."
        });
    }
    try {
        const token = foundUser.getResetPasswordToken();
        await foundUser.save();
        const resetURL = `${req.protocol}://${req.get('host')}/password/reset-password/${token}`;

        const resetPassword = ` <p>You requested a password reset.</p>
                                <p><a href="${resetURL}">Click here to reset your password</a></p>
                                <p>This link expires in 15 minutes.</p>
                            `;

        await sendEmail({
            email:email,
            subject:"Reset Your Password",
            message:resetPassword
        });
        return res.status(200).json({
          message: "Password reset link sent to your email"
        });
    }catch (err){
        console.log(err);
    }
}

const resetPasswordConfirm = async (req, res) => {
  const { token, password } = req.body;


  if (!password || password.length < 8) {
    return res.status(400).json({ message: "Password too short" });
  }


  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const now = new Date();
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: now },
  });
  
  if (!user) {
    return res.status(400).json({ message: "Token invalid or expired" });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
};


module.exports = {
    handleReVerification ,
    handleNewUser, 
    handleLogout, 
    handleGetUser , 
    handleUserUpdate,
    handleResetPassword,
    resetPasswordConfirm
};