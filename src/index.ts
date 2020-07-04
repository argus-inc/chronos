import {log, debug, LogType} from '@argus-inc/logger'
// say hello
log(`Hello World`, LogType.Success)
// debug example
debug([{hello: "world"}])
// run forever
setInterval(() => {}, 1 << 30);
// handle exit process
function exitHandler(options, exitCode) {
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