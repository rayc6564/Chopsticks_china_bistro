import express from 'express';
import passport from 'passport';
import User from '../models/user.mjs';
import { validationResult } from 'express-validator';
import { validateRegister } from '../middlewares/validation.mjs';

const router = express.Router();

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