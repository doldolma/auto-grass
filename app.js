require('dotenv').config();

const schedule = require('node-schedule');
const express = require('express');
const db = require('./models')
const scheduler = require('./schedulers');
const debug = require('debug')('app:scheduler');
const router = require('./api');
const views = require("./views/views");
const logger = require('morgan');
const cors = require('cors');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dbConfig = require("./models/config");
const MySQLStore = require("express-mysql-session")(session);

const app = express();
app.enable('trust proxy');
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/public", express.static("public"));
app.set("view engine", "pug");
app.set("views", __dirname + "/public/views");

// 스케줄러 목록
const jobList = [];

const getJobList = (req, _, next) => {
    req.jobList = jobList;
    next();
};

app.use(express.static('public'));
app.use(logger('dev'));

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'doldolmaridoldolma',
    store: new MySQLStore({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
    }),
}))

app.use("/jobs", getJobList, router.jobs);
app.use("/user", router.user);
app.use("/", views);

// table 동기화
db.sequelize.sync();

// 프로세스 종료 요청 시 스케줄 중지시키고 프로그램 종료
process.on('SIGINT', function () { 
    schedule.gracefulShutdown()
    .then(() => process.exit(0))
});

// express 실행
app.listen(process.env.PORT, async () => {
    console.log("listening on", process.env.PORT);
    // 스케줄러 실행
    jobList.push(
        schedule.scheduleJob("자동 잔디심기 스케줄러", '30 0 0 * * *', () => {
            debug("잔디심기!");
            scheduler.setGrass();
        }
    ));
});