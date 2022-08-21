
import { Request, Response } from "express"
import { mysqlService } from './mysql'
import moment from "moment";

const headers = {
  'Access-Control-Allow-Origin': '*', // 允许跨域
  'Content-Type': 'application/json;charset=UTF-8'
}

export class ExportProcess {
  create = async (req: Request, response: Response) => {
    console.log(req.body)
    let processKey = req.body.processKey
    let sql = '\n'
    let sql1 = `
    select 
    * -- 替换字段
    from t_proc_custom   t where t.tenant_id='caih'  and  t.proc_version = (SELECT max(a.proc_version) FROM t_proc_custom a WHERE a.proc_def_key = t.proc_def_key
          and a.tenant_id = 'caih') and t.proc_def_key  in ('${processKey}','');`
    let data = await mysqlService.sqlQuery(req.body.environment, sql1);
    if (data && data.length > 0) {
      let e = data[0];
      sql += `insert into t_proc_custom ` + getKeyValuseForInsert(e) + '\n'
    }
    // 2.添加更新状态语句
    let sql2 = `UPDATE t_proc_custom set state = '0' WHERE proc_def_key = '${processKey}';`
    sql += sql2 + '\n'

    // 3.查询	t_form_templet 导出为插入语句
    let sql3 = `
        select
        * -- 替换字段
        from t_form_templet where form_def_key in (select form_def_key from t_proc_custom   t where t.tenant_id='caih'  and  t.proc_version = (SELECT max(a.proc_version) FROM t_proc_custom a WHERE a.proc_def_key = t.proc_def_key
        and a.tenant_id = 'caih') and t.proc_def_key  in ('${processKey}','') )	and status='1';`
    data = await mysqlService.sqlQuery(req.body.environment, sql3);
    if (data && data.length > 0) {
      let e = data[0];
      sql += `insert into t_form_templet ` + getKeyValuseForInsert(e) + '\n'
    }

    // 4.查询	t_form_bytearray 导出为插入语句	
    let sql4 = `
        select 
        * -- 替换字段
        from t_form_bytearray where bytearray_id in (
	      select form_bytearray_id from t_form_templet where form_def_key in (select form_def_key from t_proc_custom   t where t.tenant_id='caih'  and  t.proc_version = (SELECT max(a.proc_version) FROM t_proc_custom a WHERE a.proc_def_key = t.proc_def_key
        and a.tenant_id = 'caih') and t.proc_def_key  in ('${processKey}','') )	and status='1');`
    data = await mysqlService.sqlQuery(req.body.environment, sql4);
    if (data && data.length > 0) {
      let e = data[0];
      sql += `insert into t_form_bytearray ` + getKeyValuseForInsert(e) + '\n'
    }
    
    response.send(sql)
  }
}


function getKeyValuseForInsert(e) {
  let keys = '(';
  let values = '(';
  for (let key in e) {
    keys += `\`${key}\`,`;
    console.log("key: " + key + " type: " + typeof e[key])
    if (typeof e[key] === 'string') {
      values += `'${e[key].replace(/\'/g, '\\\'')}',`;
    } else if (typeof e[key] === 'object') {
      try {
        let time = moment(e[key]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        if (time === 'Invalid date') {
          values += `'${e[key].replace(/\'/g, '\\\'')}',`;
        } else {
          values += `'${time}',`;
        }
      } catch {
        if (e[key] === 'NULL') {
          values += `${e[key]},`;
        } else {
          values += `'${e[key]}',`;
        }
      }
    } else if (typeof e[key] === 'number') {
      values += `${e[key]},`;
    } else {
      values += `'${e[key].replace(/\'/g, '\\\'')}',`;
    }
  }
  keys += ') '
  values += '); \n'
  let sql = keys.replace(',)', ')') + 'values' + values.replace(',)', ')')
  sql = sql.replace(/\"/g, '\\"')
  return sql;
}

