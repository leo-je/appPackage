import mysql from 'mysql';
import { config } from './config'
let dbType: mysql.Connection = null;
let mysqlService = {
    devDb: dbType,
    uatDb: dbType,
    initDb: function () {
        if (!this.devDb) {
            this.devDb = mysql.createConnection(config.db.connection.mysql.dev)
        }
        if (!this.uatDb) {
            this.uatDb = mysql.createConnection(config.db.connection.mysql.uat)
        }
    },
    sqlQuery: function (dbType, sql):any {
        let _this = this;
        return new Promise(function (resolve, reject) {
            // pool.getConnection(function(err,connection){
            //   if(err){
            //     reject(err);
            //     return; 
            //   }
            //   connection.query( sql , params , function(error,res){
            //     connection.release();
            //     if(error){
            //       reject(error);
            //       return;
            //     }
            //     resolve(res);
            //   });
            // });
            if (dbType === 'dev') {
                _this.devDb.query(sql, (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                })
            }
            if (dbType === 'uat') {
                _this.uatDb.query(sql, (err, result) => {
                    if (err) {
                        return console.log("错误")
                        reject(err)
                    }
                    resolve(result)
                })
            }
        });
    }
}

mysqlService.initDb()
export { mysqlService }