const router = require("express").Router();
const checkLogin = require("../middleware/checkLogin");
const { User, CommitLog } = require("../models");

const clientId = process.env.GITHUB_CLIENT_ID;


router.get("/", (req, res) => {
    const userId = req.session.userId;
    if(!userId) return res.render("home", { clientId });
    res.redirect("/list");
});

router.get("/logout", checkLogin, (req, res) => {
    req.session.destroy();
    return res.redirect("/");
});

router.get("/list", checkLogin, async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findByPk(userId);
    const commits = await CommitLog.findAll({ where: {userId}, order: [["id", "DESC"]]});

    return res.render("list", {user, commits: commits.map(commit => {
        commit.date = commit.createdAt.toLocaleDateString() + " " + commit.createdAt.toLocaleTimeString();
        return commit;
        })});
});

router.get("/custom", checkLogin, async (req, res) => {
    return res.render("custom");
});


module.exports = router;