const User = require("../data/users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();
const {handleFailedLogin, resetLoginAttempts} = require("../utils/handleLoginAttempts");

const handleLogin = async (req,res,next) => {
    const {user, pwd} = req.body;
    const ip = req.ip;
    if(!user || !pwd){
        await handleFailedLogin(user,ip);
        return res.status(400).json({
            mesage: 'username and password are required'
        });
    }
    const foundUser = await User.findOne({ username: user });
    if (!foundUser){
        await handleFailedLogin(user,ip);
        return res.sendStatus(401);
    }

    const role = Object.values(foundUser.roles);
    const match = await bcrypt.compare(pwd, foundUser.password);
    if(match && foundUser.isVerified) {

        const accessToken = jwt.sign(
            {UserInfo: 
                {
                    id: foundUser._id,
                    username: foundUser.username,
                    role
                }},
            process.env.ACCESS_TOKEN_KEY,
            {expiresIn: '30m'}
        );
        const refreshToken = jwt.sign(
            { id:foundUser._id },
            process.env.REFERESH_TOKEN_KEY,
            {expiresIn: '1d'}
        );
        foundUser.refreshTokens.push(refreshToken);
        const result = await foundUser.save();
        await resetLoginAttempts(user, ip);
        res.cookie('jwt',refreshToken,{
            httpOnly: true,
            secure:false,
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });
    }
    else {
        await handleFailedLogin(user,ip);
        console.log("unauzotirzed");
        res.sendStatus(401);
    }
}


const verifyEmail = async (req,res,next) => {
    try{
        const token = req.params['verificationToken'];
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpiration:{$gt: new Date()}
        });

        if(!user){
            return res.status(400).json({
                message: 'Verification token is invalid or has expired'
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiration = undefined;

        await user.save();
        next()
    } catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Server error during email verification'
        });
    }
}


module.exports = {
    handleLogin, 
    verifyEmail
};