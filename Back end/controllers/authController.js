const User = require("../data/users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const handleLogin = async (req,res,next) => {
    const {user, pwd} = req.body;
    if(!user || !pwd) return res.status(400).json({
        mesage: 'username and password are required'
    });
    const foundUser = await User.findOne({username: user});
    const role = Object.values(foundUser.roles);
    if(!foundUser) return res.sendStatus(401);

    const match = await bcrypt.compare(pwd, foundUser.password);
    if(match && foundUser.isVerified) {

        const accessToken = jwt.sign(
            {UserInfo: 
                {
                    id: foundUser._id,
                    "username": foundUser.username,
                    role
                }},
            process.env.ACCESS_TOKEN_KEY,
            {expiresIn: '30m'}
        );
        const refreshToken = jwt.sign(
            { username:foundUser.username },
            process.env.REFERESH_TOKEN_KEY,
            {expiresIn: '1d'}
        );
        foundUser.refreshTokens.push(refreshToken);
        const result = await foundUser.save();

        res.cookie('jwt',refreshToken,{
            httpOnly: true,
            secure:false,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });
    }
    else {
        
        res.sendStatus(401);
    }
}


const verifyEmail = async (req,res) => {
    try{
        const token = req.params['verificationToken'];
        console.log(token);
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpiration:{$gt: Date.now()}
        });

        if(!user){
            return res.status(400).json({
                message: 'Verification token is invalid or has expired'
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiration = undefined;

        res.status(200).json({
            message:`Email verified successfully`
        });
    } catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Server error during email verification'
        });
    }
}


module.exports = {handleLogin, verifyEmail}