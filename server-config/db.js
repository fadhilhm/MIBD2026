const sql = require('mssql');

const sqlConfig = {
    user: 'adminTester',
    password: 'admin1234',
    server: 'localhost',
    database: 'CarRentalDB',
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

let pool;

async function connectMS_SQL() {
    try {
        console.log("Connecting to SQL Server...");
        pool = await sql.connect(sqlConfig);
        console.log("Connected to SQL Server!");
        return pool;
    } catch (error) {
        console.error("Database connection failed :(\n", error);
        throw error;
    }
}

function getPool() {
    if (!pool) throw new Error("Database not connected :(");
    return pool;
}

module.exports = { connectMS_SQL, getPool, sql };