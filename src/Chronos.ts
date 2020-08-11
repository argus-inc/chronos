import { Cron } from "./Cron";
import { exec } from "child_process";
import { log, LogType, debug } from "@argus-inc/logger";
import { FileHandler } from "@argus-inc/fluct";
import { execute } from "./Helpers";
const fs = new FileHandler('.chronos');

export class Chronos {
    entities: Cron[]
    currentCrons: string | undefined
    currentChronosEntities: any[]
    constructor(entities: any) {
        this.entities = this.load(entities)
        this.currentChronosEntities = []
    }

    load(entities: Cron[]) {
        let result = []
        for (let index = 0; index < entities.length; index++) {
            try {
                result.push(new Cron(entities[index]))
            } catch (error) {
                console.log(error)
            }
        }
        return result
    }

    async compile() {
        const start = "# do not touch - sChronos"
        const end = "# mederic burlet - eChronos"
        let temp = []
        console.log(process.execPath)
        for (let index = 0; index < this.entities.length; index++) {
            const fullCron = await this.entities[index].compile()
            console.log(fullCron)
            temp.push(fullCron)
        }
        const chronosCron = `${start}\n${temp.join('\n')}\n${end}`
        const pathed = fs.createPath(['tempChronos.txt'], true)
        if (await this.loadExistingCrontab()) {
            if (fs.exists(pathed)) {
                fs.delete(pathed)
            }
            await this.deleteExistingCrontab()
            //await this.resetExistingCrontab()
            //const namesOnly = this.currentChronosEntities.map(e => e.cron)
            //let intersection = namesOnly.filter(x => temp.includes(x));
            //console.log(intersection)
            //TODO: compare all (make regex to view modifictions and check on path) recurrence might be diff
            if(fs.save(pathed, `${this.currentCrons}\n${chronosCron}`)) {
                log(`Temporary cron job file saved`, LogType.Success)
            }
            if(await this.saveToCrontab(pathed)){
                log(`${this.entities.length} Cronjobs were saved to the machine`, LogType.Success)
            }
        } else {
            //await this.deleteExistingCrontab()
            //await this.resetExistingCrontab()
            log(`No already existing chornos crons in the system for this user`, LogType.Warning)
            if(fs.save(pathed, `${chronosCron}`)) {
                log(`Temporary cron job file saved`, LogType.Success)
            }
            if (await this.saveToCrontab(pathed)) {
                log(`${this.entities.length} Cronjobs were saved to the machine`, LogType.Success)
            }
        }
        return chronosCron
    }



    loadExistingCrontab() {
        return execute(`crontab -l`).then((crons: any) => {
            this.currentCrons = crons.toString()
            const backupPath = fs.createPath(['backup'], true)
            log(`backup path is: ${backupPath}`)
            if (!fs.exists(backupPath)) {
                fs.createDir(backupPath)
            }
            const backupFilePath = `${backupPath}/${+ new Date()}.bak`
            if(fs.save(backupFilePath, crons)) {
                log(`Back up file was save at: ${backupFilePath}`, LogType.Success)
            }
            if (this.currentCrons) {
                this.isolateChronosCrontab(this.currentCrons)
            }
            return true
        }).catch(e => {
            log(e)
            return false
        })
    }

    deleteExistingCrontab() {
        return execute(`crontab -r`).then(crons => {
            return true
        }).catch(e => {
            return false
        })
    }

    /*resetExistingCrontab() {
        return this.execute(`cat /dev/null | crontab -`).then(crons => {
            return true
        }).catch(e => {
            return false
        })
    }*/

    isolateChronosCrontab(str: string) {
        const regex = /#.*sChronos(.*)#.*eChronos/gms;
        let m, fullMatch: string;
        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                // Track the full chronos config from the crontab
                if (groupIndex === 0) { fullMatch = match }
                if (groupIndex === 1) {
                    // clean and sanitize 
                    const trimmed = match.trim().split('\n')
                    for (let index = 0; index < trimmed.length; index++) {
                        const element = { cron: trimmed[index], toDelete: false, isNew: false };
                        this.currentChronosEntities.push(element)
                    }
                    if(this.currentCrons) {
                        while (this.currentCrons.includes(fullMatch)) {
                            this.currentCrons = this.currentCrons.replace(fullMatch, '')
                        }
                        this.currentCrons = this.currentCrons.replace(/^\s*\n/gm, "").trim();
                        return true
                    } else {
                        return false
                    }
                }
            });
        }
        return false
    }

    async saveToCrontab(filePath: string) {
        return execute(`crontab ${filePath}`).then(crons => {
            return true
        }).catch(e => {
            log(e)
            return false
        })
    }

}