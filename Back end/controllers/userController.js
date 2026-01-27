const bcrypt = require('bcrypt');
const User = require('./../data/users');
const User_List = require('./../config/roles');
const sendEmail = require('../middleware/sendEmail');

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
        const verificationURL = `${req.protocol}://${req.get('host')}/verifyemail/${verificationToken}`

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



const handleLogout = async (req, res) => {
    const cookies = req.cookies;

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


module.exports = {handleReVerification ,handleNewUser, handleLogout};