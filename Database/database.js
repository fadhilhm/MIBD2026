const sql = require('mssql');

// Connection config and mapping 
const config = {
    user: 'User123',
    password: 'Passwrod123',
    server: 'localhost',
    database: 'CarRentalDB',
    options:{
        encrypt: false,
        trustServerCertificate: true
    }
};


// 

