const express = require('express');
const router = express.Router();
const c = require('../controllers');
const authorize = require('../middleware/authorize');
const roles = require('../common/constant/roles');

router.get('/', authorize([roles.SUPERADMIN, roles.ADMIN]), c.consultation.index);
router.get('/:id', authorize([roles.SUPERADMIN, roles.ADMIN]), c.consultation.show);
router.post('/', authorize(), c.consultation.create);
router.put('/:id', authorize([roles.SUPERADMIN, roles.ADMIN]), c.consultation.update);
router.put('/:id/start', authorize([roles.SUPERADMIN, roles.ADMIN]), c.consultation.start);
router.put('/:id/end', authorize([roles.SUPERADMIN, roles.ADMIN]), c.consultation.end);
router.delete('/:id', authorize([roles.SUPERADMIN, roles.ADMIN]), c.consultation.delete);

module.exports = router;