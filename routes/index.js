const express = require('express');
const router = express.Router();

const auth = require('./auth');
const user = require('./user');
const customer = require('./customer');
const admin = require('./admin');
const image = require('./image');

router.use('/auth', auth);
router.use('/users', user);
router.use('/customers', customer);
router.use('/admins', admin);
router.use('/images', image);

module.exports = router;