import { PreComponent, PreComponentInterface } from "@/core";
import { Express } from "express";

import fs from 'fs';
import path from 'path';


@PreComponent(100, 'cacheService')
export class CacheService implements PreComponentInterface {
    private cache: any = {};
    private cacheFile = path.resolve(__dirname, './cache')
    enable(app: Express): void {
        let e = fs.existsSync(this.cacheFile)
        if (!e) {
            this.syncToFile();
        } else {
            this.LoadFromFile()
        }
    }

    public LoadFromFile(){
        const data = fs.readFileSync(this.cacheFile, { encoding: 'utf-8' }).toString();
        this.cache = JSON.parse(data);
    }

    public syncToFile(): void {
        fs.writeFileSync(this.cacheFile, JSON.stringify(this.cache));
    }

    public get(key:string){
        return this.cache[key];
    }

    public set(key:string, value:any):void {
        this.cache[key] = value;
        this.syncToFile()
    }
}