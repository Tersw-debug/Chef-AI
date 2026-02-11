const express = require('express');
const router = express.Router();

const {handleResetPassword, resetPasswordConfirm} = require('./controllers/userController');

router.post('/resetpassword', handleResetPassword)


router.get('/reset-password/:token', (req, res) => {
  res.redirect(302, `${req.protocol}://localhost:5173/ResetPasswordForm/${req.params.token}`);
});

// 3️⃣ Submit new password
router.post('/reset-password/confirm', resetPasswordConfirm);

module.exports = router