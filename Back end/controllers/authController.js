const User = require("../data/users")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
    if(match) {
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

        res.json({ accessToken });
    }
    else {
        
        res.sendStatus(401);
    }
}

module.exports = handleLogin