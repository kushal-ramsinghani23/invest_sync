const express = require('express');
const router = express.Router();
const { getCompanies, createCompany } = require('../controllers/companyController');

router.get('/', getCompanies);
router.post('/', createCompany);

module.exports = router;