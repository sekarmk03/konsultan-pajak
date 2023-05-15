const express = require('express');
const router = express.Router();
const c = require('../controllers');
const authorize = require('../middleware/authorize');
const roles = require('../common/constant/roles');

router.get('/', authorize([roles.SUPERADMIN, roles.ADMIN]), c.customer.index);
router.get('/:id', authorize(), c.customer.show);
router.post('/', authorize(), c.customer.create);
router.put('/:id', authorize(), c.customer.update);
router.delete('/:id', authorize([roles.SUPERADMIN, roles.ADMIN]), c.customer.delete);

module.exports = router;