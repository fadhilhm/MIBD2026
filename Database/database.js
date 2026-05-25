const sql = require('mssql/msnodesqlv8');

// Connection config and mapping 
const config = {
    user: 'ECLIPSE73\\pearc',
    password: '',
    server: 'ECLIPSE73',
    database: 'CarRentalDB',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
        trustServerCertificate: true,
        encrypt: false
    }
};


// Connection state & error handling. 
sql.connect(config, function (err) {
    if (err) console.log(err);
    var request = new sql.Request();
    request.query("SELECT * FROM MOBIL", function (err, records) {
        if (err) console.log(err)
        if (err) {
            console.log(records);
        } else {
            console.log(records);
        }
    })
});

// const poolPromise = new sql.ConnectionPool(config)
//     .connect()
//     .then(pool => {
//         console.log('---------------------------------------------------------');
//         console.log(' SUCCESS: Connected smoothly to MS SQL Server [CarRentalDB]!');
//         console.log('---------------------------------------------------------');
//         return pool;
//     })
//     .catch(err => {
//         console.error('---------------------------------------------------------');
//         console.error(' CRITICAL ERROR: Database Connection Failure!');
//         console.error(' Details:', err.message);
//         console.log('---------------------------------------------------------');
//         process.exit(1);
//     });
// module.exports = {
//     sql, poolPromise
// };

// if (require.main === module) {
//     (async () => {
//         try {
//             console.log('Initiating database network handshake...');
//             await poolPromise;
//             console.log('Handshake verified! Your script is ready to serve queries.');
//             process.exit(0);
//         } catch (error) {
//             process.exit(1);
//         }
//     })();
// }
