import mysql from 'mysql';
import { config } from './config'
let dbType: mysql.Pool = null;
let mysqlService = {
    devDbPool: dbType,
    uatDbPool: dbType,
    initDb: function (dbType) {
        if (!this.devDbPool && dbType == 'dev') {
            console.log("dev initDb")
            this.devDbPool = mysql.createPool(config.db.connection.mysql.dev)
        }
        if (!this.uatDbPool && dbType == 'uat') {
            console.log("uat initDb")
            this.uatDbPool = mysql.createPool(config.db.connection.mysql.uat)
        }
    },
    sqlQuery: function (dbType, sql): any {
        let _this = this;
        _this.initDb(dbType)
        return new Promise(function (resolve, reject) {
            if (dbType === 'dev') {
                _this.devDbPool.getConnection((err, conn) => {
                    if (err) {
                        console.error(err)
                        reject(null)
                    } else {
                        conn.query(sql, (err2, results, fields) => {
                            //事件驱动回调
                            if (err2) {
                                _this.devDbPool = null;
                                console.log("dev mysql 错误")
                                console.error(err2)
                                reject(null)
                            }
                            // console.log(fields)
                            resolve(results)
                        })
                    }
                })
            }
            if (dbType === 'uat') {
                _this.uatDbPool.getConnection((err, conn) => {
                    if (err) {
                        console.error(err)
                        reject(null)
                    } else {
                        conn.query(sql, (err2, results, fields) => {
                            //事件驱动回调
                            if (err2) {
                                _this.uatDbPool = null;
                                console.log("uat mysql 错误")
                                console.error(err2)
                                reject(null)
                            }
                            // console.log(fields)
                            resolve(results)
                        })
                    }
                })
            }
        });
    },
}

export { mysqlService }