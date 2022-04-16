const exec = require("child_process").exec;
const debug = require("debug")("app:exec")


module.exports = (command) => {
    // UNIX 명령어를 수행하고 결과를 리턴
    return new Promise((resolve, reject) => {
        try {
            command = `#!/bin/bash\n${command}`;
            exec(command, (error, stdout, stderr) => {
                console.log("RUN COMMAND ", command);
                console.log("[RESULT] : ", error ? 'FAIL' : 'SUCCESS');
                console.log(`[OUTPUT]\n[STDOUT] : " ${stdout}\n [STDERR] ${stderr}`);
                error ? reject(error.message) : resolve(stdout);
            });
        } catch (ex) {
            reject(ex);
        }
    });
};