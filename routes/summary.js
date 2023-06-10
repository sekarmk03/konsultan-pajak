const express = require('express');
const router = express.Router();
const c = require('../controllers');
const authorize = require('../middleware/authorize');
const roles = require('../common/constant/roles');

router.get('/customer', authorize([roles.SUPERADMIN, roles.ADMIN]), c.summary.customer);
router.get('/admin', authorize([roles.SUPERADMIN, roles.ADMIN]), c.summary.admin);
router.get('/schedule', authorize([roles.SUPERADMIN, roles.ADMIN]), c.summary.schedule);
router.get('/consultation', authorize([roles.SUPERADMIN, roles.ADMIN]), c.summary.consultation);

module.exports = router;