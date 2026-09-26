const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { requireAuth } = require('../middleware/auth');

module.exports = (io) => {
    router.get('/', companyController.getCompanies);
    router.get('/stats', companyController.getStats);
    router.get('/activity', companyController.getActivity);

    router.post('/', requireAuth, (req, res) => companyController.createCompany(req, res, io));
    router.put('/:id', requireAuth, (req, res) => companyController.updateCompany(req, res, io));
    router.delete('/:id', requireAuth, (req, res) => companyController.deleteCompany(req, res, io));

    return router;
};