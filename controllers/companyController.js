const { query } = require('../db/query');

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

    if (!name) {
        return res.status(400).json({ error: 'Company name is required' });
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

module.exports = { getCompanies, createCompany };