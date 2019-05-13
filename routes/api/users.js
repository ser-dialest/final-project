// taken from ucd boilerplate
const router = require('express').Router();
const usersController = require('../../controllers/usersController');

// Matches with "/api/books"
router.route('/login').post(usersController.login);
router.route('/validate').post(usersController.validateToken);
router.route('/signup').post(usersController.signup);

module.exports = router;
