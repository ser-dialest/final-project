const router = require('express').Router();
// const postRoutes = require('./posts');
const userRoutes = require('./users');

// Book routes
// router.use('/posts', postRoutes);
router.use('/users', userRoutes);

module.exports = router;
