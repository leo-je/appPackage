import { error, log, PreComponent, PreComponentInterface, Value } from "nea-boot";
import fs from 'fs';
import path from 'path';
const sqlite3 = require('sqlite3').verbose();
// const configHandle = require('@/config')

@PreComponent(100,'sqlite3Service')
export class Sqlite3Service implements PreComponentInterface {

    @Value('sqlite.dbFilePath')
    private dbFilePath: string
    db: any

    enable(_app: any) {
        let dbpath = path.resolve(process.cwd(), '..') + this.dbFilePath
        log('dbpath:'+dbpath)
        this.init(dbpath)
    }

    init(file) {
        let exist = fs.existsSync(file);
        if (!exist) {
            error("Creating db file!");
            fs.openSync(file, 'w');
        }
        this.db = new sqlite3.Database(file);
    }

    printErrorInfo(err) {
        log("Error Message:" + err.message + " ErrorNumber:" + err.no);
    }

    createTable(sql, errCallback?) {
        this.db.serialize(() => {
            this.db.run(sql, (err) => {
                if (null != err) {
                    if (errCallback) {
                        errCallback(err)
                    } else {
                        this.printErrorInfo(err);
                    }
                    return;
                }
            });
        });
    }

    /// tilesData format; [[level, column, row, content], [level, column, row, content]]
    async insertData(sql, objects) {
        this.db.serialize(() => {
            let stmt = this.db.prepare(sql);
            if (objects) {
                for (let i = 0; i < objects.length; ++i) {
                    stmt.run(objects[i]);
                }
            }
            stmt.finalize();
        });
    }

    queryDataSyc(sql): Promise<any> {
        let _this = this
        return new Promise(function (resolve, reject) {
            _this.db.all(sql, (err, rows: any) => {
                if (err) {
                    error(err)
                    resolve(null)
                }
                else resolve(rows)
            })
        })
    }

    queryData(sql, callback, errCallback?) {
        this.db.all(sql, (err, rows) => {
            if (null != err) {
                if (errCallback) {
                    errCallback(err)
                } else {
                    this.printErrorInfo(err);
                }
                return;
            }

            /// deal query data.
            if (callback) {
                callback(rows);
            }
        });
    }

    executeSqlSyc(sql): Promise<any> {
        return new Promise(function (resolve, reject) {
            this.db.run(sql, function (err) {
                if (null != err) {
                    reject(err)
                } else {
                    resolve(true)
                }
            });
        })
    }

    executeSql(sql, callback?) {
        this.db.run(sql, (err) => {
            if (null != err) {
                this.printErrorInfo(err);
            } else {
                if (callback) {
                    callback();
                }
            }
        });
    }

    close() {
        this.db.close();
    }

}
