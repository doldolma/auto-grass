const express = require('express');
const git = require("../utils/gitCommands");
const { User } = require("../models");
const checkLogin = require("../middleware/checkLogin");
const addCommits = require('../utils/custom');
const axios = require("axios");
const debug = require("debug")("app:api")

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;


const router = express.Router();

router.get("/callback", async (req, res) => {
    const code = req.query.code;

    // 코드를 토큰으로 교환
    const token = (await axios.post("https://github.com/login/oauth/access_token", {
        client_id, client_secret, code,
    },{ headers: {"Accept": "application/json"}})).data.access_token;
    debug("token : ", token);

    if(!token) return res.redirect("/");

    let userInfo;
    let emails;

    // 유저 정보와 이메일 정보 조회
    await Promise.all([
        axios.get("https://api.github.com/user", {
            headers: {"Accept": "application/json", "Authorization": `token ${token}`}
        }).then((res) => userInfo = res.data),
        axios.get("https://api.github.com/user/emails", {
            headers: {"Accept": "application/json", "Authorization": `token ${token}`}
        }).then((res) => emails = res.data),
    ]);
    userInfo.email = emails.find(mail => mail.verified && mail.visibility === "public").email;

    debug("userInfo : ", userInfo);

    let user = await User.findOne({where: {login: userInfo.login}});
    if(!user) {
        // 신규가입
        if(!userInfo.email) {
            return res.status(400).send('<center>활성화된 이메일주소를 확인할 수 없습니다. <br /> 이메일 주소를 등록하고 커밋을 날려야 잔디가 심어져요. <br /> <a href="https://github.com/settings/emails">깃허브 이메일 설정</a>에서 Keep my email addresses private 체크해제하고 다시 시도해주세요.</center>');
        }
        user = await User.create({...userInfo, accessToken: token})
    } else {
        user.accessToken = token;
        user.email = userInfo.email;
        await user.save();
    }

    git.checkRepo(user.accessToken).then((result) => {
        if(!result) {
            git.newRepo();
        }
    })

    req.session.userId = user.id;
    return res.redirect("/");
});

router.post("/commit/onoff", checkLogin, async (req, res) => {
    const onOff = req.body.onOff;
    debug("onOff : ", onOff);
    if(onOff === undefined) return res.status(400).json("잘못된 요청");

    await User.update({active : onOff}, {
        where: { id: req.session.userId }
    });

    return res.json("success");
});

router.post("/commit/count", checkLogin, async (req, res) => {
    const minCount = req.body.minCount;
    const maxCount = req.body.maxCount;
    if(!minCount || !maxCount) return res.status(400).json("Fail");

    const user = await User.findByPk(req.session.userId);
    user.minCommits = parseInt(minCount);
    user.maxCommits = parseInt(maxCount);
    await user.save();
    return res.json("good");
});


router.post("/custom", checkLogin, async (req, res) => {
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;

    debug("startDate : ", startDate.toLocaleString());
    debug("endDate : ", endDate.toLocaleString());

    if(!startDate || ! endDate) {
        return res.status(400).json("날짜를 입력해주세요.");
    }

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    const user = await User.findByPk(req.session.userId);

    addCommits(startDate, endDate, user);

    return res.json("success");
});

module.exports = router;