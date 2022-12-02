
import { exec, cd } from 'shelljs';
import { config } from '../../../service/config';
import { WebSocketService } from './WebSocketService';
import { Request, Response } from "express"
import { AutoWired, Component, getComponentInstance } from '@/core';

let log = ''
let logHistory = ''
let isProcess = false
let childProcess = null
let childProcessId = null

@Component("appPackageSergvice")
export class AppPackageSergvice {

    @AutoWired('webSocketService')
    private webSocketService: WebSocketService

    // constructor() {
    //     getComponentInstance('webSocketService').then(component => {
    //         this.webSocketService = component
    //     }).catch(e => {
    //         console.error(`[${__filename}] get component fail`, e)
    //     })
    // }
    cancelPackageApp = (req: Request, res: Response) => {
        if (childProcess != null && childProcessId) {
            exec("kill -9 " + childProcessId, function (code, stdout, stderr) {
                console.log('Exit code:', code);
                console.log('Program output:', stdout);
                console.log('Program stderr:', stderr);
                let msg = "close " + childProcessId + " ok"
                if (stderr) {
                    msg = "can't close " + childProcessId
                } else {
                    childProcessId = null
                    childProcess = null
                }

                res.send({
                    msg
                })
            })

        } else
            res.send({
                msg: 'not process'
            })
    }

    packageUatApp = (req: Request, res) => {
        let _this = this
        try {
            let branch = req.body.branch
            console.log(branch)
            if (!isProcess) {
                logHistory = ''
                isProcess = true
                log = cd(config.appRootDirPath)
                //   shell.exit(1);
                log += "start package uat app"
                logHistory += log + '\n\nprocecc is running\n\n'
                // log += shell.exec('./gradlew assembleRelease')
                if (branch) {
                    logHistory += '拉取代码：git pull \n'
                    exec("git checkout -- . && git pull ")
                    logHistory += '切换分支：git checkout ' + branch + '\n'
                    exec("git checkout " + branch)
                    // shell.exec("git pull ")
                }
                childProcess = exec('/bin/bash ./uat-package.sh', { async: true }, function (code, stdout, stderr) {
                    // console.log('Exit code:', code);
                    // console.log('Program output:', stdout);
                    // console.log('Program stderr:', stderr);
                    isProcess = false;
                    // logHistory += stdout
                    if (stderr) {
                        logHistory += '\n\n\nerr：=============================>\n' + stderr
                        _this.webSocketService.sendCmd({ dataType: 'packLog', data: '\n\n\nerr：=============================>\n' + stderr }, null)
                    }
                    childProcess = null

                });

                childProcessId = childProcess.pid

                console.log(childProcessId)

                childProcess.stdout.on("data", function (data) {
                    logHistory += data;
                    _this.webSocketService.sendCmd({ dataType: 'packLog', data })
                })

                childProcess.stdout.on("close", function () {
                    logHistory += "\n脚本执行完成!";
                    _this.webSocketService.sendCmd({ dataType: 'packLog', data: "\n脚本执行完成!" })
                })

                childProcess.addListener('message', (message, sendHandle) => {
                    console.log("message ==========================> ", message)
                })

            } else {
                log = 'Process is running'
            }

        } catch (e) {
            console.error('packageUatApp -->\n', e)
            log = 'packageUatApp -->\n' + e
        }
        res.send({
            msg: log,
            logArray: logHistory
        })
    }

    getPackageLog = (req, res) => {
        res.send({
            log: logHistory
        })
    }

    packageProdApp = (req, res) => {
        let _this = this
        try {
            let branch = req.body.branch
            console.log(branch)
            if (!isProcess) {
                logHistory = ''
                isProcess = true
                log = cd(config.appRootDirPath)
                //   shell.exit(1);
                log += "start package prod app"
                logHistory += log + '\n\nprocecc is running\n\n'
                // log += shell.exec('./gradlew assembleRelease')
                if (branch) {
                    logHistory += '拉取代码：git pull \n'
                    exec("git checkout -- . && git pull ")
                    logHistory += '切换分支：git checkout ' + branch + '\n'
                    exec("git checkout " + branch)
                    // shell.exec("git pull ")
                }
                childProcess = exec('sh ./prod-package.sh', { async: true }, function (code, stdout, stderr) {
                    // console.log('Exit code:', code);
                    // console.log('Program output:', stdout);
                    // console.log('Program stderr:', stderr);
                    isProcess = false;
                    // logHistory += stdout
                    if (stderr) {
                        logHistory += '\n\n\nerr：=============================>\n' + stderr
                        _this.webSocketService.sendCmd({ dataType: 'packLog', data: '\n\n\nerr：=============================>\n' + stderr })
                    }
                    childProcess = null

                });

                childProcess.stdout.on("data", function (data) {
                    logHistory += data;
                    _this.webSocketService.sendCmd({ dataType: 'packLog', data })
                })

                childProcess.stdout.on("close", function () {
                    logHistory += "\n脚本执行完成!";
                    _this.webSocketService.sendCmd({ dataType: 'packLog', data: "\n脚本执行完成!" })
                })

            } else {
                log = 'Process is running'
            }
        } catch (e) {
            console.error('packageUatApp -->\n', e)
            log = 'packageUatApp -->\n' + e
        }
        res.send({
            msg: log,
            logArray: logHistory
        })
    }


    packageDebugApp = (req, res) => {
        let _this = this
        try {
            let branch = req.body.branch
            console.log(branch)
            if (!isProcess) {
                logHistory = ''
                isProcess = true
                log = cd(config.appRootDirPath)
                //   shell.exit(1);
                log += "start package debug app"
                logHistory += log + '\n\nprocecc is running\n\n'
                // log += shell.exec('./gradlew assembleRelease')
                if (branch) {
                    logHistory += '拉取代码：git pull \n'
                    exec("git checkout -- . && git pull ")
                    logHistory += '切换分支：git checkout ' + branch + '\n'
                    exec("git checkout " + branch)
                    // shell.exec("git pull ")
                }
                childProcess = exec('/bin/bash ./debug-package.sh', { async: true }, function (code, stdout, stderr) {
                    // console.log('Exit code:', code);
                    // console.log('Program output:', stdout);
                    // console.log('Program stderr:', stderr);
                    isProcess = false;
                    // logHistory += stdout
                    if (stderr) {
                        logHistory += '\n\n\nerr：=============================>\n' + stderr
                        _this.webSocketService.sendCmd({ dataType: 'packLog', data: '\n\n\nerr：=============================>\n' + stderr })
                    }

                    childProcess = null

                });

                childProcess.stdout.on("data", function (data) {
                    logHistory += data;
                    _this.webSocketService.sendCmd({ dataType: 'packLog', data })
                })

                childProcess.stdout.on("close", function () {
                    logHistory += "\n脚本执行完成!";
                    _this.webSocketService.sendCmd({ dataType: 'packLog', data: "\n脚本执行完成!" })
                })

                childProcess.addListener('message', (message, sendHandle) => {
                    console.log("message ==========================> ", message)
                })

            } else {
                log = 'Process is running'
            }

        } catch (e) {
            console.error('packageDebugApp -->\n', e)
            log = 'packageDebugApp -->\n' + e
        }
        res.send({
            msg: log,
            logArray: logHistory
        })
    }
}
