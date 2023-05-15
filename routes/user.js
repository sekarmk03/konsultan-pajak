const express = require('express');
const router = express.Router();
const c = require('../controllers');
const authorize = require('../middleware/authorize');
const roles = require('../common/constant/roles');

router.get('/', authorize([roles.SUPERADMIN, roles.ADMIN]), c.user.index);
router.get('/:id', authorize(), c.user.show);
router.post('/', authorize([roles.SUPERADMIN]), c.user.create);
router.put('/:id', authorize([roles.SUPERADMIN, roles.ADMIN]), c.user.update);
router.delete('/:id', authorize([roles.SUPERADMIN]), c.user.delete);

module.exports = router;