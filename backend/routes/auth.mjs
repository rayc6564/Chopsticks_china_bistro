import express from 'express';
import passport from 'passport';
import User from '../models/user.mjs';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import { validateRegister } from '../middlewares/validation.mjs';

const router = express.Router();

// reset password
const resetPassword = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_USER
    }
});

// Send password reset email
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetLink = `${req.protocol}://${req.get('host')}/auth/reset-password/${resetToken}`;
        await transporter.sendMail({
            to: email,
            subject: 'Password Reset',
            text: `Click this link to reset your password: ${resetLink}`,
        });

        res.json({ message: 'Password reset link sent to your email.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send reset email.' });
    }
});

// Handle password reset
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token.' });
        }

        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ message: 'Password has been reset successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to reset password.' });
    }
});


// register a new user
router.post('/register', 
    validateRegister,
    async (request, response) => {
        const handleErrors = validationResult(request);

        if (!handleErrors.isEmpty()) {
            return response.status(400)
            .send({ handleErrors: `There is an error: ${handleErrors.array()}` 

            });
        }

        const { username, password, email } = request.body;
        try {
            const newUser = new User({ username, password, email });
            await newUser.save();
            response.send(`Register!!!: ${username}`);
        } catch (error) {
            response.status(400).send(`Fail to register: ${error}`);
        }
});

// login a user
router.post('/login', 
    passport.authenticate('local', {
        // Redirect to the login page on failure
        failureRedirect: '/auth/login',
        failureMessage: true
    }),
     
    (request, response) => {
        response.send(`Login!!!: ${request.user.username}`);
    }
);

// logout a user
router.get('/logout', (request, response) => {
    request.logout(err => {
        if (err) {
            return response.status(500).send('Error logging out');
        }
        request.session.destroy(() => {
            response.clearCookie('connect.sid');
            response.redirect('/auth/login');
        });
    });
});



export default router;