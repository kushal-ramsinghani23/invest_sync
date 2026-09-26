const { query } = require('../db/query');
const { logActivity } = require('../db/activityLog');
const { asyncHandler } = require('../middleware/asyncHandler');

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

const getCompanies = asyncHandler(async (req, res) => {
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
});

// CHANGED: wrapped in asyncHandler, removed try/catch — errors now flow to centralized errorHandler
const createCompany = asyncHandler(async (req, res, io) => {
    const { name, sector, stage, metric_value } = req.body;

    const error = validateCompanyInput(req.body);
    if (error) {
        return res.status(400).json({ error });
    }

    const result = await query(
        `INSERT INTO companies (name, sector, stage, metric_value)
                VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, sector, stage, metric_value]
    );
    const company = result.rows[0];
    io.emit('companyCreated', company);
    const logEntry = await logActivity('CREATED', company.name, `Stage: ${company.stage}`);
    io.emit('activityLogged', logEntry);
    res.status(201).json(company);
});

// CHANGED: wrapped in asyncHandler, removed try/catch
const updateCompany = asyncHandler(async (req, res, io) => {
    const { id } = req.params;
    const { name, sector, stage, metric_value } = req.body;

    const error = validateCompanyInput(req.body);
    if (error) {
        return res.status(400).json({ error });
    }

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
    const logEntry = await logActivity('UPDATED', company.name, `Stage: ${company.stage}, Value: ${company.metric_value}`);
    io.emit('activityLogged', logEntry);
    res.json(company);
});

// CHANGED: wrapped in asyncHandler, removed try/catch
// FIXED: removed stray `res.status(201).json(company)` that was sent BEFORE the real
// `res.json({ message, company })` below — sending two responses on one request would
// crash with "ERR_HTTP_HEADERS_ALREADY_SENT" the first time this endpoint was hit.
const deleteCompany = asyncHandler(async (req, res, io) => {
    const { id } = req.params;

    const result = await query(
        'DELETE FROM companies WHERE id = $1 RETURNING *',
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Company not found' });
    }
    const company = result.rows[0];
    io.emit('companyDeleted', company);
    const logEntry = await logActivity('DELETED', company.name, 'Removed from tracking');
    io.emit('activityLogged', logEntry);
    res.json({ message: 'Company deleted successfully', company });
});

// CHANGED: wrapped in asyncHandler, removed try/catch
const getStats = asyncHandler(async (req, res) => {
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
});

// CHANGED: wrapped in asyncHandler, removed try/catch
const getActivity = asyncHandler(async (req, res) => {
    const result = await query('SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 20');
    res.json(result.rows);
});

module.exports = { validateCompanyInput, getCompanies, createCompany, updateCompany, deleteCompany, getStats, getActivity };