import { log } from "@argus-inc/logger"
import { FileHandler } from "@argus-inc/fluct";
import { execute } from "./Helpers";
import { runInThisContext } from "vm";
const fs = new FileHandler('.chronos');

export class Cron {
    recurrence: string
    name: string
    path: string
    command: string
    constructor(toParse: any) {
        if (toParse.recurrence) {
            this.recurrence = toParse.recurrence
        } else {
            throw new Error("No recurrence set")
        }

        if (toParse.path) {
            this.path = toParse.path
        } else {
            throw new Error("No path set")
        }

        if (toParse.command) {
            this.command = toParse.command
        } else {
            throw new Error("No command set")
        }

        if (toParse.name) {
            this.name = toParse.name
        } else {
            throw new Error("No name")
        }
    }

    locateCommand() {
        return new Promise((resolve, reject) => {
            if(this.command === "node") {
                this.command = process.execPath
                resolve(process.execPath)
            } else {
                execute(`which ${this.command}`).then(which => {
                    if (typeof which === 'string'){
                        this.command = which
                        resolve(which)
                    }
                }).catch(e => {
                    reject(false)
                })
            }
        })
    }

    /**
     * Compile the module into a viable cronjob
     */
    compile() {
        return this.locateCommand().then(e => {
            return `${this.recurrence} ${this.command} ${this.path}`
        }).catch(e => {
            throw new Error(`Couldn't find command: ${this.command}`);
        })
        
    }

}