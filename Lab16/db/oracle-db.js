process.env.ORA_SDTZ = 'UTC';

const oracledb = require('oracledb');
const dbConfig = require('./../config').oracle;

// YOU MUST SETUP ALL REQUIREMENTS
// IF YOU DON'T HAVE ORACLE SERVER ON LOCAL MACHINE, INSTALL CLIENT LIBS

const options = { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT };
let connectionPool;

class Db {

    constructor() {
        oracledb.createPool(dbConfig).then(pool => connectionPool = pool);
    }

    getAll(tableName) {
        const sql = formSelectAllSQLQuery(tableName);
        return this.simpleExecute(sql);
    }

    getOne(tableName, fields) {
        const sql = formSelectSQLQuery(tableName, fields);
        return this.simpleExecute(sql);
    }

    insertOne(tableName, fields) {
        const sql = formInsertSQLQuery(tableName, fields);
        return this.simpleExecute(sql);
    }

    updateOne(tableName, fields) {
        const sql = formUpdateSQLQuery(tableName, fields);
        return this.simpleExecute(sql);
    }

    deleteOne(tableName, id) {
        const sql = formDeleteSQLQuery(tableName, id);
        return this.simpleExecute(sql);
    }

    simpleExecute(statement, binds = [], opts = options) {
        return new Promise(async (resolve, reject) => {
            let conn;

            try {
                conn = await connectionPool.getConnection();

                const result = await conn.execute(statement, binds, opts);

                resolve(result.rows);
            } catch (err) {
                console.log('simpleExecute ERROR:');
                console.log(err);
                reject(err);
            } finally {
                if (conn) { // conn assignment worked, need to close
                    try {
                        await conn.close();
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
        });
    }

}

function formSelectAllSQLQuery(tableName) {
    return `SELECT * FROM ${tableName}`;
}

function formSelectSQLQuery(tableName, fields) {
    let sql = `SELECT * FROM ${tableName} WHERE`;

    Object.keys(fields).forEach(field => {
        sql += ` ${field} = ${convertToSQLValue(fields[field])} AND`;
    });
    sql = sql.slice(0, -3);

    return sql;
}

function formInsertSQLQuery(tableName, fields) {
    let sql = `INSERT INTO ${tableName} values (`;

    Object.keys(fields).forEach((field) => {
        sql += `${convertToSQLValue(fields[field])},`;
    });
    sql = sql.replace(/.$/, ")");

    return sql;
}

function formUpdateSQLQuery(tableName, fields) {
    let sql = `UPDATE ${tableName} SET `;

    Object.keys(fields).forEach(field => {
        sql += `${field} = ${convertToSQLValue(fields[field])},`;
    });

    sql = sql.slice(0, -1);
    sql += ` WHERE ${tableName} = '${fields[tableName]}'`;

    return sql;
}

function formDeleteSQLQuery(tableName, id) {
    return `DELETE FROM ${tableName} WHERE ${tableName} = ${convertToSQLValue(id)}`;
}

function convertToSQLValue(value) {
    if (typeof value === 'string') {
        return `'${value}'`;
    } else {
        return value;
    }
}

module.exports.Db = Db;
