import { body } from 'express-validator';

export const validateRegister = [
    body('username')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long.'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long.')
];