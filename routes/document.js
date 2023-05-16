const express = require('express');
const router = express.Router();
const c = require('../controllers');
const authorize = require('../middleware/authorize');
const roles = require('../common/constant/roles');
const multer = require('multer');
const upload = multer();

router.get('/', authorize([roles.SUPERADMIN, roles.ADMIN]), c.document.index);
router.get('/:id', authorize(), c.document.show);
router.post('/', authorize(), upload.single('doc'), c.document.create);
router.put('/:id', authorize(), upload.single('doc'), c.document.update);
router.delete('/:id', authorize(), c.document.delete);

module.exports = router;