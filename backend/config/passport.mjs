import User from '../models/user.mjs';
import { Strategy } from 'passport-local';
import passport from 'passport';

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const findUser = await User.findById(id);
        done(null, findUser);
    } catch (error) {
        done(error, null);
    }
});

passport.use(
    new Strategy(async (username, password, done) => {
        try {
            const findUser = await User.findOne({ username });
            if (!findUser) {
                return done(null, false, { message: "User not found" });
            }

            const isMatch = await findUser.isValidPassword(password);
            if (!isMatch) {
                return done(null, false, { message: "Password incorrect" });
            }

            done(null, findUser);
        } catch (error) {
            done(error, null);
        }
    }
));