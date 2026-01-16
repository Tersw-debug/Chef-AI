user = require("../data/users")
bcrypt = require('bcrypt')
jwt = require('jsonwebtoken')
require('dotenv').config();

const handleLogin = async (req,res,next) => {
    const {user, pwd} = req.body;
    if(!user || !pwd) return res.status(400).json({
        mesage: 'username and password are required'
    });
    const foundUser = await user.findOne({username: user}).exec();
    if(!foundUser) return res.sendStatus(401);

    const match = await bcrypt.compare(pwd, foundUser.password);
    if(match) {
        const accessToken = jwt.sign(
            {"username": foundUser.username},
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