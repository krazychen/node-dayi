const mysql = require('mysql');
const config = require('../config/default');

module.exports = {
    con_write,
    con_read
}

function con_write() {
    let dbConfig = config.my_dbConfig_master;
    let connection = mysql.createConnection(dbConfig);
    connection.connect();
    return connection;
}

function con_read() {
    let dbConfig = config.my_dbConfig_slave;
    let connection = mysql.createConnection(dbConfig);
    connection.connect();
    return connection;
}
