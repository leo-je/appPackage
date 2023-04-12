import { ConfigInfo, ValueInfo } from "./Config";
import fs from 'fs';
import yaml from 'js-yaml';
import { log } from "../../utils/CommonUtils";
import { ComponentInfo } from "../../Interface";

export class ConfigManager {
    private defConfigFileName = 'Application'
    public config = {
        env: process.env,
        service: {
            name: 12,
            port: 8080
        }
    }
    configs: Map<string, ConfigInfo> = new Map(); // 添加Controller之前需要添加的组件集合
    valueConfigs: Map<string, ValueInfo> = new Map(); // 添加Controller之前需要添加的组件集合

    addConfig(configInfo: ConfigInfo, key?: string) {
        if (!key) {
            key = configInfo.targetId
        }
        this.configs.set(key, configInfo)
    }

    init() {
        try {
            let data1 = this.loadYmlFile('./' + this.defConfigFileName + '.yaml')
            let data2 = this.loadYmlFile('./' + this.defConfigFileName + '.yml')
            let data = {}
            if (data1) {
                merge(data, data1)
            }
            if (data2) {
                merge(data, data2)
            }
            // log(data);
            //this.config = 
            merge(this.config, data)
            // log(this.config);
        } catch (e) {
            console.log(e);
        }
    }

    loadYmlFile(filePath: string): Object {
        let b = fs.existsSync(filePath)
        if (b) {
            let fileContents = fs.readFileSync(filePath, 'utf8');
            let data = yaml.load(fileContents)
            return data;
        }
        return null;
    }

    addValueConfig(valueInfo: ValueInfo, key?: string) {
        if (!key) {
            key = valueInfo.targetId
        }
        this.valueConfigs.set(key, valueInfo)
    }

    loadConfig(componentsOnKey: Map<any, ComponentInfo>) {
        // log(`========================= load preComponent========================`)
        log(`========================= load config =============================`)
        this.configs.forEach((value: ConfigInfo, key: string, map) => {
            let data1 = this.loadYmlFile(value.configFilePath)
            if (data1) {
                merge(this.config, data1)
            }
        })
        this.valueConfigs.forEach((value, key: string, map) => {
            let targetId = value.targetId
            let component = componentsOnKey.get(value.target.constructor)
            if (component) {
                let s = value.keyPath.split('.')
                let v = null
                let _v: any = this.config
                for (let i = 0; i < s.length; i++) {
                    _v = _v[s[i]]
                    if (!_v) {
                        break;
                    }
                }
                if (!_v && value.defaultValue) {
                    _v = value.defaultValue
                }
                if (_v) {
                    switch (value.valueType) {
                        case 'string':
                            v = _v;
                            break;
                        case 'number':
                            v = Number(_v);
                            break;
                        case 'boolean':
                            v = _v.toUpperCase() === 'TRUE' ? true : false;
                            break;
                        case 'object':
                            v = _v
                            break;
                    }
                }
                if(v){
                    component.instance[value.propertyKey] = v
                }

            }
        })
    }
}

function merge(def, obj) {
    if (!obj) {
        return def;
    }
    else if (!def) {
        return obj;
    }

    for (var i in obj) {
        // if its an object
        if (obj[i] != null && obj[i].constructor == Object) {
            def[i] = merge(def[i], obj[i]);
        }
        // if its an array, simple values need to be joined. object values need to be re-merged.
        else if (obj[i] != null && (obj[i] instanceof Array) && obj[i].length > 0) {
            // test to see if the first element is an object or not so we know the type of array we're dealing with.
            if (obj[i][0].constructor == Object) {
                var newobjs = [];
                // create an index of all the existing object ids for quick access. there is no way to know how many items will be in the arrays.
                var objids = {}
                for (var x = 0, l = def[i].length; x < l; x++) {
                    objids[def[i][x].id] = x;
                }

                // now walk through the objects in the new array
                // if the id exists, then merge the objects.
                // if the id does not exist, push to the end of the def array
                for (var x = 0, l = obj[i].length; x < l; x++) {
                    var newobj = obj[i][x];
                    if (objids[newobj.id] !== undefined) {
                        def[i][x] = merge(def[i][x], newobj);
                    }
                    else {
                        newobjs.push(newobj);
                    }
                }

                for (var x = 0, l2 = newobjs.length; x < l2; x++) {
                    def[i].push(newobjs[x]);
                }
            } else {
                for (var x = 0; x < obj[i].length; x++) {
                    var idxobj = obj[i][x];
                    if (def[i].indexof(idxobj) === -1) {
                        def[i].push(idxobj);
                    }
                }
            }
        } else {
            // if (obj[i] instanceof Number || i.indexOf('_key') > -1) {
            //     def[i] = obj[i];
            // }else {
            def[i] = obj[i];
            // }
        }
    }
    return def;
}

// new ConfigManager().init()