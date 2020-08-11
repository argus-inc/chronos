import {FileHandler} from '@argus-inc/fluct';
import { LogType, log } from '@argus-inc/logger';
import { exec } from 'child_process';
const fs = new FileHandler();
export interface ConfigItem {
    path: string
    recurrence: string
    command: string
    name: string | undefined
}
export const validateConfig = (config: Array<ConfigItem>) => {
    let result: any = {valid: false, errors: []}
    if (config.length > 0) {
        let validItems = 0
        for (let index = 0; index < config.length; index++) {
            const isValid = validateConfigItem(config[index])
            if (isValid.valid) {validItems++}
        }
        if (validItems == config.length) {
            result.valid = true
            return result
        }
    } else {
        result.errors.push("There are no items in the config.")
        return result
    }
    
}

const validateConfigItem = (configItem: ConfigItem) => {
    let result: any = {valid: true, errors: []}
    if (!fs.exists(configItem.path)) {
        log(`Config file not found: ${configItem.path}`, LogType.Error)
        result.errors.push("File does not exist")
        result.valid = false
    }
    //TODO: implement  crontab index
    //if(configItem.recurrence !== "*/5 * * * *") {
    //    result.errors.push("Recurrence not found")
    //    result.valid = false
    //}
    return result
}

export const execute = (command: string) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) { reject(error) }
            resolve(stdout)
        });
    })
};