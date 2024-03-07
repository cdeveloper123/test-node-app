const express = require('express');
const formController = require('../controller');

const router = express.Router();

router.get('/:formId/filteredResponses', formController.getFilteredResponses);

module.exports = router;
