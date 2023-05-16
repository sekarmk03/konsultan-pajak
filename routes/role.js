const express = require('express');
const router = express.Router();
const c = require('../controllers');
const authorize = require('../middleware/authorize');
const roles = require('../common/constant/roles');

router.get('/', authorize([roles.SUPERADMIN, roles.ADMIN]), c.role.index);
router.get('/:id', authorize([roles.SUPERADMIN, roles.ADMIN]), c.role.show);
router.post('/', authorize([roles.SUPERADMIN]), c.role.create);
router.put('/:id', authorize([roles.SUPERADMIN]), c.role.update);
router.delete('/:id', authorize([roles.SUPERADMIN]), c.role.delete);

module.exports = router;