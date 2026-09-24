const express = require('express');
const router = express.Router();
const { getCompanies } = require('../controllers/companyController');

router.get('/', getCompanies);

module.exports = router;