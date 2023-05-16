const express = require('express');
const router = express.Router();
const c = require('../controllers');
const authorize = require('../middleware/authorize');
const roles = require('../common/constant/roles');
const multer = require('multer');
const upload = multer();

router.get('/', authorize([roles.SUPERADMIN, roles.ADMIN]), c.image.index);
router.get('/:id', authorize(), c.image.show);
router.post('/', authorize(), upload.single('image'), c.image.create);
router.put('/:id', authorize(), upload.single('image'), c.image.update);
router.delete('/:id', authorize(), c.image.delete);

module.exports = router;