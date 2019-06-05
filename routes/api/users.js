// taken from ucd boilerplate
const router = require('express').Router();
const usersController = require('../../controllers/usersController');

// Matches with "/api/users"
router.route('/login').post(usersController.login);
router.route('/validate').post(usersController.validateToken);
router.route('/signup').post(usersController.signup);
router.route('/save').post(usersController.validateToken, usersController.save);
router.route('/load').post(usersController.validateToken, usersController.load);

module.exports = router;
