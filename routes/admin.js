const express = require('express');
const router = express.Router();
const c = require('../controllers');
const authorize = require('../middleware/authorize');
const roles = require('../common/constant/roles');

router.get('/', authorize([roles.SUPERADMIN]), c.admin.index);
router.get('/:id', authorize([roles.SUPERADMIN, roles.ADMIN]), c.admin.show);
router.post('/', authorize(), c.admin.create);
router.put('/:id', authorize(), c.admin.update);
router.delete('/:id', authorize([roles.SUPERADMIN]), c.admin.delete);

module.exports = router;