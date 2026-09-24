const pool = require('./pool');

const query = (text, params) => {
    return pool.query(text, params);
};

module.exports = { query };