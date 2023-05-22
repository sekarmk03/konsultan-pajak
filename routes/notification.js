const express = require('express');
const router = express.Router();
const c = require('../controllers');
const authorize = require('../middleware/authorize');
const roles = require('../common/constant/roles');

router.get('/', authorize(), c.notification.index);
router.get('/:id', authorize(), c.notification.show);
router.post('/', authorize([roles.SUPERADMIN, roles.ADMIN]), c.notification.create);
router.put('/:id', authorize([roles.SUPERADMIN, roles.ADMIN]), c.notification.update);
router.put('/:id/read', authorize(), c.notification.read);
// router.put('/read', authorize(), c.notification.readAll);
router.delete('/:id', authorize([roles.SUPERADMIN, roles.ADMIN]), c.notification.delete);

module.exports = router;