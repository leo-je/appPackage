
import { Request, Response } from "express"
import moment from "moment";
import { AutoWired, Component } from "@/core";
import { MysqlService } from "@/sys/service/MysqlService";

const headers = {
  'Access-Control-Allow-Origin': '*', // 允许跨域
  'Content-Type': 'application/json;charset=UTF-8'
}

@Component('exportDatasourceService')
export class ExportDatasourceService {


  @AutoWired('mysqlService')
  private mysqlService:MysqlService

  query = async (req: Request, response: Response) => {
    console.log(req.body)
    let sourceName = req.body.sourceName
    let pageSize = req.body.pageSize
    let pageNum = req.body.pageNum
    let startRows = 0;
    if (!pageSize) pageSize = 10
    if (!pageNum) pageNum = 1
    startRows = (pageNum - 1) * pageSize
    let data
    let count = 0
    let json = []
    let sql1 = `
    select * from t_form_re_data_source `
    if (sourceName && sourceName != '') {
      sql1 += `where source_Name like '%${sourceName}%'`
    }
    sql1 += ' order by gmt_Create desc '
    try {
      data = await this.mysqlService.sqlQuery(req.body.environment, `select count(*) count from (${sql1}\n) a`);
      if (data && data.length > 0) {
        count = data[0]["count"]
      }
    } catch (e) {
      console.error(e)
      response.send(e)
      return
    }
    sql1 = `${sql1} limit ${startRows},${pageSize}`
    try {
      data = await this.mysqlService.sqlQuery(req.body.environment, sql1);
    } catch (e) {
      console.error(e)
      response.send(e)
      return
    }
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let e = data[i]
        let row = {}
        for (let key in e) {
          row[handler(key)] = e[key]
        }
        let sql = `insert into t_form_re_data_source ` + getKeyValuseForInsert(e) + '\n'
        row['sql'] = sql
        json[json.length] = row
      }

    }

    response.send({
      data: json,
      pageInfo: {
        total: count
      }
    })
  }
}

function handler(str) {
  let feng = ``;
  let arr = str.toLowerCase().split(`_`);
  let newArr = arr.map((ele, idx) => {
    return idx === 0 ? ele : ele[0].toUpperCase() + ele.slice(1)
  })
  feng = newArr.join(``);
  return feng;
}

function getKeyValuseForInsert(e) {
  let keys = '(';
  let values = '(';
  let type = '';// 1:string 2:Date 3:number 4:NULL/null 5:Buffer
  let time = '';
  for (let key in e) {
    keys += `\`${key}\`,`;
    // console.log("key: " + key + " type: " + typeof e[key])
    if (typeof e[key] === 'string') {
      type = '1';
      // values += `'${e[key].replace(/\'/g, '\\\'')}',`;
    } else if (!e[key]) {
      type = '4'
      // values += `${e[key]},`;
    } else if (typeof e[key] === 'object' && Buffer.isBuffer(e[key])) {
      type = '5'
    } else if (typeof e[key] === 'object') {
      try {
        time = moment(e[key]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        type = '2'
        if (time === 'Invalid date') {
          // values += `'${e[key].replace(/\'/g, '\\\'')}',`;
        } else {
          // values += `'${time}',`;
        }
      } catch {
        console.log('catch:' + e[key])
        if (e[key] === 'NULL' || e[key] === 'null') {
          type = '4'
          // values += `${e[key]},`;
        } else {
          type = '1'
          // values += `'${e[key]}',`;
        }
      }
    } else if (typeof e[key] === 'number') {
      type = '3'
      // values += `${e[key]},`;
    } else {
      type = '1'
      // values += `'${e[key].replace(/\'/g, '\\\'')}',`;
    }
    //
    if (type == '1' || type == '') {
      values += `'${e[key].replace(/\'/g, '\\\'')}',`;
    } else if (type == '2') {
      if (time === 'Invalid date') {
        console
        values += `'${e[key].replace(/\'/g, '\\\'')}',`;
      } else {
        values += `'${time}',`;
      }
    } else if (type == '5') {
      const str = '0x' + Buffer.from(e[key]).toString('hex').toUpperCase();
      values += `${str},`;
    } else {
      values += `${e[key]},`;
    }
  }

  keys += ') '
  values += '); \n'
  let sql = keys.replace(',)', ')') + 'values' + values.replace(',)', ')')
  sql = sql.replace(/\"/g, '\\"')
  return sql;
}

