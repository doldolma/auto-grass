const { User, CommitLog } = require('../models');
const git = require("../utils/gitCommands");

module.exports = async () => {
    /**
     * active 된 모든 유저들에게 commit을 날려준다
     * commit은 commit.txt 파일에 랜덤 값을 작성해서 날린다.
     * accessToken이 올바르지 않은 경우 active를 False로 변경하고 넘어간다.
     * 성공적인 commit이 되었을 경우 commit log를 남긴다.
      */
    const users = await User.findAll({where: {active: true}});
    for (const user of users) {
        let count;
        try {
            count = await git.addCommit(user);
        } catch (ex) {
            console.log("ex", ex);
            user.active = false;
            user.save();
            CommitLog.create({
                userId: user.id,
                result: false,
                message: ex.toString(),
            });
            continue;
        }
        CommitLog.create({
            userId: user.id,
            result: true,
            count
        })
    }
};