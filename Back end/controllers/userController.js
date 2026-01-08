const bcrypt = require('bcrypt');
const User = require('./../data/users');



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
            password:hash
        });
        const result = await newUser.save();
        res.status(201).json({ 'message': `New user ${username} created successfully.` });
    }
    catch (err) {
        console.error(err)
    }
};


module.exports = handleNewUser;