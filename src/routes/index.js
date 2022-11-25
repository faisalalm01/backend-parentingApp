const mainRoutes = require('express').Router();
const authRoutes = require('./authRoutes');

mainRoutes.use('/auth', authRoutes);

module.exports = mainRoutes;