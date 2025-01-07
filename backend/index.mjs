import express from 'express';
import passport from 'passport';
import mongoose from 'mongoose';
import session from 'express-session';
import authRoutes from './routes/auth.mjs';
import config from '.config/env.mjs';
import './config/passport.mjs';


const app = express();

const sec = 1000;
const minute = sec * 60;
const day = minute * 24;

// connect to mongodb
mongoose.connect(config.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(`Fail to connect to MongoDB: ${err.message}`));


app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        // Prevents JavaScript access to cookies
        httpOnly: true,
        // HTTPS only in production
        secure: process.env.NODE_ENV === 'production',
        // Cookie expires in 1 day
        maxAge: day
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('frontend'));

app.use('/auth', authRoutes);

app.listen(config.PORT, () => {
    console.log(`Running on server Port: ${PORT}`);
});