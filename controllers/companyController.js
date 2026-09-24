const { query } = require('../db/query');

const VALID_STAGES = ['In Review', 'Due Diligence', 'Invested', 'Passed'];

const validateCompanyInput = (data) => {
    const { name, stage, metric_value } = data;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return 'Company name is required';
    }
    if (stage && !VALID_STAGES.includes(stage)) {
        return `Stage must be one of: ${VALID_STAGES.join(', ')}`;
    }
    if (metric_value !== undefined && (isNaN(metric_value) || metric_value < 0)) {
        return 'metric_value must be a non-negative number';
    }
    return null; // no error
};

const getCompanies = async (req, res) => {
    try {
        const result = await query('SELECT * FROM companies ORDER BY updated_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch companies' });
    }
};

const createCompany = async (req, res) => {
    const { name, sector, stage, metric_value } = req.body;

    const error = validateCompanyInput(req.body);
    if (error) {
        return res.status(400).json({ error });
    }

    try {
        const result = await query(
            `INSERT INTO companies (name, sector, stage, metric_value)
                    VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, sector, stage, metric_value]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create company' });
    }
};

const updateCompany = async (req, res) => {
    const { id } = req.params;
    const { name, sector, stage, metric_value } = req.body;

    const error = validateCompanyInput(req.body);
    if (error) {
        return res.status(400).json({ error });
    }

    try {
        const result = await query(
            `UPDATE companies
                    SET name = $1, sector = $2, stage = $3, metric_value = $4, updated_at = NOW()
                    WHERE id = $5 RETURNING *`,
            [name, sector, stage, metric_value, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update company' });
    }
};

const deleteCompany = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query(
            'DELETE FROM companies WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.json({ message: 'Company deleted successfully', company: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete company' });
    }
};

module.exports = { getCompanies, createCompany, updateCompany, deleteCompany, validateCompanyInput };