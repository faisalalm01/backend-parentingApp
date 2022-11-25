const userRoutes = require('express').Router();
const userController = require('../controllers/authControllers');

userRoutes.post('/sign-up', userController.signUp);
userRoutes.post('/sign-in', userController.signIn);
userRoutes.put('/edituser/:id', userController.edituser);

module.exports = userRoutes;