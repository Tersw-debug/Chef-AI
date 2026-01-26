const User = require('./../data/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if(!cookies?.jwt) {
        return res.sendStatus(401);
    }

    const refreshToken = cookies.jwt;

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: false
    });

    const foundUser = await User.findOne({
        refreshTokens: refreshToken
    });

    if(!foundUser)
    {
        try {
            jwt.verify(
                refreshToken,
                process.env.REFERESH_TOKEN_KEY,
                async (err, decoded) => {
                    if(!err){
                        const hackedUser = await User.findOne({
                            username: decoded.username
                        });
                        if(hackedUser){
                            hackedUser.refreshTokens = [];
                            await hackedUser.save();
                        }
                    }
                }
            );
        } catch(err){
            console.log(err);
        }
        return res.sendStatus(403);
    }
    const newRefreshTokenArray = foundUser.refreshTokens.filter(rt => rt !== refreshToken);

    jwt.verify(
        refreshToken,
        process.env.REFERESH_TOKEN_KEY,
        async (err, decoded) =>{
            if(err || decoded.username !== foundUser.username){
                foundUser.refreshTokens = newRefreshTokenArray;
                await foundUser.save();
                return res.sendStatus(403);
            }

            const accessToken = jwt.sign(
                {UserInfo: {
                    id: foundUser._id,
                    "username": foundUser.username,
                    role: Object.values(foundUser.roles)
                }},
                process.env.ACCESS_TOKEN_KEY,
                {expiresIn: '30m'}
            );

            const newRefreshToken = jwt.sign(
                {username: foundUser.username},
                process.env.REFERESH_TOKEN_KEY,
                {expiresIn: "1d"}
            );

            foundUser.refreshTokens = [...newRefreshTokenArray, newRefreshToken];
            await foundUser.save();

             res.cookie('jwt', newRefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'None',
                maxAge: 24 * 60 * 60 * 1000
            });

            res.json({ accessToken });

        }
    );

}


module.exports = handleRefreshToken