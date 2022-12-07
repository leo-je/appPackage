
import { Request, Response } from "express"
// mock/server.js
import fs from 'fs'
import path from 'path'
import { mime } from './mime'
import { config } from '../../../service/config'
import { Component } from "@/core"

const headers = {
  'Access-Control-Allow-Origin': '*', // 允许跨域
  'Content-Type': 'application/json;charset=UTF-8'
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

@Component('fileInfoService')
export class FileInfoService {

  getFileList = (request: Request, response: Response) => {
    // 获取资源文件的绝对路径
    let filePath = '';//path.resolve(__dirname + '/fileDir/' + pathName)
    filePath = config.appRootDirPath + config.appreleaseDirPath
    console.log(filePath)
    let stats = fs.statSync(filePath);
    // 目录
    if (stats.isDirectory()) {
      console.log('isDirectory')
      var json = {}
      let files = fs.readdirSync(filePath)
      //   headers['Content-Type'] = 'text/html'
      // response.writeHead(200, headers)
      let data = []
      for (let i = 0; i < files.length; i++) {
        let stat = fs.statSync(path.join(filePath, files[i]));
        if (stat.isFile()) {
          // console.log(stat)
          data.push({
            fileName: files[i],
            updateTime: stat.mtime,
            addr: '/' + files[i],
            size: formatBytes(stat.size)
          });
        }

      }
      json["data"] = data
      // console.log(json)
      return json
    }
    return {}
  }




  downFile = (request: Request, response: Response) => {
    let pathName = request.params.fileName
    // 防止中文乱码
    pathName = decodeURI(pathName)
    // 获取资源文件的绝对路径
    let filePath = '';//path.resolve(__dirname + '/fileDir/' + pathName)
    filePath = filePath = config.appRootDirPath + config.appreleaseDirPath + "/" + pathName
    filePath = filePath.replace(`//`, '/')
    console.log("downFile:" + filePath)
    // 文件后缀名
    let ext = path.extname(pathName)
    ext = ext ? ext.slice(1) : 'unknown'
    // 未知类型一律用 "text/plain" 类型
    headers['Content-Type'] = (mime[ext] || "'text/plain'") + ";charset=UTF-8"

    // 301重定向
    if (!pathName.endsWith('/') && path.extname(pathName) === '') {
      pathName += '/'
      var redirect = 'http://' + request.headers.host + pathName

      response.writeHead(301, { location: redirect })
      response.end()
    }

    fs.stat(filePath, (err, stats) => {
      // 未找到文件
      if (err) {
        headers['Content-Type'] = 'text/html'
        response.writeHead(404, headers)
        response.end("<h1>404 Not Found</h1>")
      }

      // 文件
      if (!err && stats.isFile()) {
        fs.readFile(filePath, (err, data) => {
          if (err) {
            response.writeHead(500, headers)
            response.end('<h1>500 Server Error</h1>')
          }

          response.writeHead(200, headers);
          response.end(data)
        })
      }

      // 目录
      if (!err && stats.isDirectory()) {
        var html = '<head><meta charset="utf-8" /></head>'

        fs.readdir(filePath, (err, files) => {
          if (err) {

            html += `<div>读取路径失败！</div>`
            response.writeHead(404, headers)
            response.end(html)

          } else {
            headers['Content-Type'] = 'text/html'
            response.writeHead(200, headers)

            for (var file of files) {
              if (file === 'index.html') {
                response.end(file)
                break
              }

              html += `<div><a href="${file}">${file}</a></div>`
            }
            response.end(html)
          }
        })
      }
    })
  }

  delete = (req: Request, response: Response) => {
    let pathName = req.params.fileName
    // 防止中文乱码
    pathName = decodeURI(pathName)
    // 获取资源文件的绝对路径
    let filePath = '';//path.resolve(__dirname + '/fileDir/' + pathName)
    filePath = filePath = config.appRootDirPath + config.appreleaseDirPath + pathName

    let stat = fs.statSync(filePath)
    if (stat.isFile) {
      // 未找到文件
      // 文件
      //fs.unlink删除文件  
      fs.unlinkSync(filePath);
      console.log('删除文件成功');
      return {
        msg: 'ok'
      }
      // 目录
    }
  }
}
