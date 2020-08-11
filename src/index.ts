import {log, debug, LogType} from '@argus-inc/logger'
import {FileHandler} from '@argus-inc/fluct';
import { argv } from 'yargs'
import { validateConfig } from './Helpers';
import { Chronos }  from './Chronos';
const fs = new FileHandler(`.chronos`);
let args: any = argv
if (args.config && fs.exists(args.config.toString())) {
  let configToValidate = []
  try {
    configToValidate = JSON.parse(fs.read(args.config.toString()))
  } catch (error) {
    log(`Could not parse the config ${args.config.toString()}`, LogType.Error)
    log(error, LogType.Error)
  }
  if(validateConfig(configToValidate).valid === true) {
    let tester = new Chronos(configToValidate)
    var exec = require('child_process').exec;
    tester.compile()
  } else {
      log(`Config ${args.config} is not a valid chronos file.`)
  }
} else {
  console.log('Please pass a config file with `--config=/var/myproject/chronos.json`')
}

// handle exit process
function exitHandler(options: any, exitCode: any) {
    //if (options.cleanup)
    //if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) {
        log(`Exiting`, LogType.Error)
        process.exit()
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));