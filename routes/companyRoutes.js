const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

module.exports = (io) => {
    router.get('/', companyController.getCompanies);
    router.post('/', (req, res) => companyController.createCompany(req, res, io));
    router.put('/:id', (req, res) => companyController.updateCompany(req, res, io));
    router.delete('/:id', (req, res) => companyController.deleteCompany(req, res, io));

    return router;
};