const express = require('express');
const router = express.Router();
const c = require('../controllers');
const authorize = require('../middleware/authorize');
const roles = require('../common/constant/roles');

router.get('/', authorize(), c.consulttype.index);
router.get('/:id', authorize(), c.consulttype.show);
router.post('/', authorize([roles.SUPERADMIN]), c.consulttype.create);
router.put('/:id', authorize([roles.SUPERADMIN]), c.consulttype.update);
router.delete('/:id', authorize([roles.SUPERADMIN]), c.consulttype.delete);

module.exports = router;