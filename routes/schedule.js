const express = require('express');
const router = express.Router();
const c = require('../controllers');
const authorize = require('../middleware/authorize');
const roles = require('../common/constant/roles');

router.get('/', authorize([roles.SUPERADMIN, roles.ADMIN]), c.schedule.index);
router.get('/:id', authorize([roles.SUPERADMIN, roles.ADMIN]), c.schedule.show);
router.post('/', authorize(), c.schedule.create);
router.put('/:id', authorize([roles.SUPERADMIN, roles.ADMIN]), c.schedule.update);
router.put('/:id/accept', authorize([roles.SUPERADMIN, roles.ADMIN]), c.schedule.accept);
router.put('/:id/decline', authorize([roles.SUPERADMIN, roles.ADMIN]), c.schedule.decline);
router.delete('/:id', authorize([roles.SUPERADMIN, roles.ADMIN]), c.schedule.delete);

module.exports = router;