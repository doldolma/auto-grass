const exec = require("./exec");
const uuid = require('uuid');
const axios = require("axios");

module.exports = {
    /**
     * GIT COMMAND 명령 모음
     */
    repoName: 'auto-grass-commit',
    getDateString: (date) => {
        let newDate;
        if(!date) newDate = new Date();
        else newDate = new Date(date);
        newDate.setHours(newDate.getHours() + 9);
        return newDate.toISOString().split(".")[0];
    },
    newRepo: async function (user) {
        await axios.post("https://api.github.com/user/repos", {
            name: this.repoName, private: true
        }, { headers: {"Accept": "application/json", "Authorization": `token ${user.accessToken}`} });

        await exec(`
        ${this.mkdir(user.login)}
        ${this.gitClone(user)}
        cd ./${this.repoName};
        ${this.randomFile()}
        ${this.gitConfig(user.email)}
        ${this.gitAdd()}
        ${this.gitCommit()}
        git branch -M main;
        ${this.gitPush()}
        rm -rf /tmp/grass/${user.login};
        `);
        return;
    },
    addCommit: async function (user, date, push=true) {
        let command = "";
        if(push){
            command += `
            ${this.mkdir(user.login)}
            ${this.gitClone(user)}
            cd ./${this.repoName};
            `
        } else {
            command += `cd /tmp/grass/${user.login}/${this.repoName};`
        }
        command += `
        ${this.randomFile()}
        ${this.gitConfig(user.email)}
        `;
        const commitsCount = this.getRandomInt(user.minCommits, user.maxCommits);
        for(let i=0; i<commitsCount; i++) {
            command += `
                ${this.randomFile()}
                ${this.gitAdd()}
                ${this.gitCommit(date)}
            `;
        }
        if(push) {
            command += `
                ${this.gitPush()}
                rm -rf /tmp/grass/${user.login};
            `;
        }
        await exec(command);
        return commitsCount;
    },
    gitClone: function(user) {
        return `git clone https://${user.login}:${user.accessToken}@github.com/${user.login}/${this.repoName}.git;`
    },
    checkRepo: async function(token, repoName=this.repoName) {
        // repo가 있는지 검사
        const result = await axios.get("https://api.github.com/user/repos", {
            headers: {"Accept": "application/json", "Authorization": `token ${token}`}
        });

        return result.data.some(repo => repo.name === this.repoName);
    },
    gitConfig: function(email) {
        return `
        git config user.name "autoCommit";
        git config user.email ${email};
        `;
    },
    mkdir: (login) => {
        return `
        rm -rf /tmp/grass/${login};
        mkdir -p /tmp/grass/${login};
        cd /tmp/grass/${login};
        `
    },
    gitAdd: () => {
        return "git add . ;"
    },
    gitCommit: function (date) {
        const dateString = this.getDateString(date);
        return `GIT_AUTHOR_DATE=${dateString} GIT_COMMITTER_DATE=${dateString} git commit -m "auto_grass";`;
    },
    gitPush: () => {
        return 'git push origin +main;';
    },
    randomFile: () => {
        return `echo ${uuid.v4()} > autoCommit.txt;`;
    },
    getRandomInt: function(min, max) {
        return ~~(Math.random() * (max + 1 - min) + min);
    }
}