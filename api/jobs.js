const express = require('express');

const router = express.Router();


// 현재 스케줄러 목록 반환
router.get("/", (req, res) => {
    return res.json(req.jobList.map((job, index) => {
        let date = new Date(job.nextInvocation());
        date.setHours(date.getHours() + 9);   // 한국시간
        return {
            index,                                  // 번호
            name: job.name,                         // 이름
            running: job.running,                   // 실행중인여부
            nextInvocation: date,                   // 다음 실행 예정시간
        };
    }));
});

// 해당 스케줄 즉시 실행
router.get("/:index/start", (req, res) => {
    const {index} = req.params;
    const job = req.jobList[index]
    if(!job) return res.status(400).json({message: "Invalid index"});
    job.job();
    return res.send("success");
});

// 해당 스케줄 삭제
router.get("/:index/cancel", (req, res) => {
    const {index} = req.params;
    const job = req.jobList[index]
    if(!job) return res.status(400).json({message: "Invalid index"});
    job.cancel();
    return res.send("success");
});

// 다음 스케줄 건너뛰기
router.get("/:index/cancelNext", (req, res) => {
    const {index} = req.params;
    const job = req.jobList[index]
    if(!job) return res.status(400).json({message: "Invalid index"});
    job.cancelNext();
    return res.send("success");
});

module.exports = router;
