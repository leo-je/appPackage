import { Component } from '@/core';
import mysql from 'mysql';
import { config } from '../../service/config'

@Component('mysqlService')
export class MysqlService {
    
    private devDbPool: mysql.Pool | any
    private uatDbPool: mysql.Pool | any

    initDb(dbType) {
        if (!this.devDbPool && dbType == 'dev') {
            console.log("dev initDb")
            this.devDbPool = mysql.createPool(config.db.connection.mysql.dev)
        }
        if (!this.uatDbPool && dbType == 'uat') {
            console.log("uat initDb")
            this.uatDbPool = mysql.createPool(config.db.connection.mysql.uat)
        }
    }
    sqlQuery(dbType, sql): any {
        console.log("开始sql查询: \n" + sql)
        let _this = this;
        _this.initDb(dbType)
        return new Promise(function (resolve, reject) {
            if (dbType === 'dev') {
                _this.devDbPool.getConnection((err, conn) => {
                    if (err) {
                        _this.devDbPool = null;
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
                            console.log("sql查询结束.")
                            _this.devDbPool.releaseConnection(conn)
                            resolve(results)
                        })
                    }
                })
            }
            if (dbType === 'uat') {
                _this.uatDbPool.getConnection((err, conn) => {
                    if (err) {
                        _this.uatDbPool = null;
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
                            console.log("sql查询结束.")
                            _this.uatDbPool.releaseConnection(conn)
                            resolve(results)
                        })
                    }
                })
            }
        });
    }
}

