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

module.exports = { getCompanies };