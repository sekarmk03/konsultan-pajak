const express = require('express');
const router = express.Router();

const auth = require('./auth');
const user = require('./user');
const customer = require('./customer');
const admin = require('./admin');
const image = require('./image');
const role = require('./role');
const document = require('./document');
const schedule = require('./schedule');
const consultation = require('./consultation');
const notification = require('./notification');
const consulttype = require('./consulttype');

router.use('/auth', auth);
router.use('/users', user);
router.use('/customers', customer);
router.use('/admins', admin);
router.use('/images', image);
router.use('/roles', role);
router.use('/documents', document);
router.use('/schedules', schedule);
router.use('/consultations', consultation);
router.use('/notifications', notification);
router.use('/consulttypes', consulttype);

module.exports = router;