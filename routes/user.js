const express = require('express');
const router = express.Router();
const c = require('../controllers');
const authorize = require('../middleware/authorize');
const roles = require('../common/constant/roles');

router.get('/', c.user.index);
router.get('/:id', c.user.show);
router.post('/', c.user.create);
router.put('/:id', c.user.update);
router.delete('/:id', c.user.delete);

module.exports = router;