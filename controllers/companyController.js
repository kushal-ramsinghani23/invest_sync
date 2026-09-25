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
        const { search, sector, stage, page = 1, limit = 10 } = req.query;
        const conditions = [];
        const values = [];
        let idx = 1;

        if (search) {
            conditions.push(`name ILIKE $${idx++}`);
            values.push(`%${search}%`);
        }
        if (sector) {
            conditions.push(`sector = $${idx++}`);
            values.push(sector);
        }
        if (stage) {
            conditions.push(`stage = $${idx++}`);
            values.push(stage);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const offset = (Number(page) - 1) * Number(limit);

        const dataResult = await query(
            `SELECT * FROM companies ${whereClause} ORDER BY updated_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
            [...values, limit, offset]
        );

        const countResult = await query(
            `SELECT COUNT(*)::int as total FROM companies ${whereClause}`,
            values
        );

        res.json({
            data: dataResult.rows,
            total: countResult.rows[0].total,
            page: Number(page),
            totalPages: Math.ceil(countResult.rows[0].total / Number(limit)) || 1,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch companies' });
    }
};

const createCompany = async (req, res, io) => {
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
        const company = result.rows[0];
        io.emit('companyCreated', company);
        res.status(201).json(company);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create company' });
    }
};

const updateCompany = async (req, res, io) => {
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

        const company = result.rows[0];
        io.emit('companyUpdated', company);
        res.json(company);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update company' });
    }
};

const deleteCompany = async (req, res, io) => {
    const { id } = req.params;

    try {
        const result = await query(
            'DELETE FROM companies WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }
        const company = result.rows[0];
        io.emit('companyDeleted', company);
        res.status(201).json(company);
        res.json({ message: 'Company deleted successfully', company });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete company' });
    }
};

const getStats = async (req, res) => {
    try {
        const totals = await query(
            `SELECT COUNT(*)::int as total_companies,
                    COALESCE(SUM(metric_value), 0)::numeric as total_value
                    FROM companies`
        );
        const byStage = await query(
            `SELECT stage, COUNT(*)::int as count FROM companies GROUP BY stage`
        );
        res.json({
            totalCompanies: totals.rows[0].total_companies,
            totalValue: totals.rows[0].total_value,
            byStage: byStage.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};

module.exports = { validateCompanyInput, getCompanies, createCompany, updateCompany, deleteCompany, getStats };