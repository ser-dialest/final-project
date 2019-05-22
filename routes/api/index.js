const router = require('express').Router();
// const postRoutes = require('./posts');
const usersRoutes = require('./users');

// router.use('/posts', postRoutes);
router.use('/users', usersRoutes);

module.exports = router;
