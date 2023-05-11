const express = require('express');
const router = express.Router();
const c = require('../controllers');
const restrict = require('../middleware/restrict');

router.post('/register', c.auth.register);
router.post('/login', c.auth.login);
router.get('/whoami', restrict, c.auth.whoami);

module.exports = router;