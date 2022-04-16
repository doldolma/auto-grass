// 대량으로 잔디 심기

const { CommitLog } = require("../models");
const git = require("./gitCommands");
const exec = require("./exec");
const debug = require("debug")("app:schedule")

module.exports = async (startDate, endDate, user) => {
    await exec(`
        ${git.mkdir(user.login)}
        ${git.gitClone(user)}
    `)

    while(startDate.getTime() <= endDate.getTime()){
        debug("잔디심기.. " + startDate.toISOString());
        debug("endDate : ", endDate);

        let count;

        try {
            count = await git.addCommit(user, startDate, false);
        } catch (ex) {
            debug("ex", ex);
            user.active = false;
            user.save();
            CommitLog.create({
                userId: user.id,
                result: false,
                message: ex.toString(),
            });
            continue;
        } finally {
            startDate.setDate(startDate.getDate() + 1);
        }
        CommitLog.create({
            userId: user.id,
            result: true,
            count
        });
    }
    try {
        await exec(`
        cd /tmp/grass/${user.login}/${git.repoName};
        ${git.gitPush()}
        rm -rf /tmp/grass/${user.login};
    `);
    } catch(e) {
        console.log(e);
    }
}