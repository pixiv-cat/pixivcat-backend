const express = require('express');
const router = express.Router();
const imageProxyController = require('../controllers/imageProxyController');
const { validateIllustId, validatePageNumber, validateExtension } = require('../middlewares/validationMiddleware');

// Multi image route
router.get('/:illustId-:pageNumber.:fileExtension', validateIllustId, validatePageNumber, validateExtension, imageProxyController.getIllustMulti);

// Single image route
router.get('/:illustId.:fileExtension', validateIllustId, validateExtension, imageProxyController.getIllustSingle);

module.exports = router;