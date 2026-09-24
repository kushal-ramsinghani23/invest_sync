const express = require('express');
const router = express.Router();
const { getCompanies, createCompany, updateCompany } = require('../controllers/companyController');

router.get('/', getCompanies);
router.post('/', createCompany);
router.put('/:id', updateCompany);

module.exports = router;