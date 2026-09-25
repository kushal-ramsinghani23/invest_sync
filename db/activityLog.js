const { query } = require('./query');

const logActivity = async (action, companyName, details = '') => {
    const result = await query(
        'INSERT INTO activity_log (action, company_name, details) VALUES ($1, $2, $3) RETURNING *',
        [action, companyName, details]
    );
    return result.rows[0];
};

module.exports = { logActivity };