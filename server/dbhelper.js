const mysql = require('mysql');
const config = require('../config/default');

const dbConfig = config.my_dbConfig_master;
// 创建数据池
const pool  = mysql.createPool(dbConfig);

function con_write() {
    let connection = mysql.createConnection(dbConfig);
    connection.connect();
    return connection;
}

function con_read() {
    let connection = mysql.createConnection(dbConfig);
    connection.connect();
    return connection;
}

let query = function( sql, values ) {
    // 返回一个 Promise
    return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject( err )
            } else {
                connection.query(sql, values, ( err, rows) => {
                    // console.log(rows);
                    if ( err ) {
                        reject( err )
                    } else {
                        resolve( rows )
                    }
                    // 结束会话
                    connection.release()
                })
            }
        })
    })
}


module.exports = {
    con_write,
    con_read,
    query
}
