var express = require('express');
var router = express.Router();
var usersController = require('../controllers/users')
const { response, getCode } = require('../middlewares')
/* GET home page. */
router.post('/register', usersController.register, response)
router.post('/login', usersController.login, response)
router.get('/auth', usersController.auth, response)
router.get('/info', usersController.info, response)
router.get('/exit', (req, res, next) => {
    req.session.user = null
    next('success')
}, response)
router.get('/code', getCode)

module.exports = router;
