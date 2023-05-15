const express = require('express');
const router = express.Router();

const auth = require('./auth');
const user = require('./user');
const customer = require('./customer');

router.use('/auth', auth);
router.use('/users', user);
router.use('/customers', customer);

module.exports = router;