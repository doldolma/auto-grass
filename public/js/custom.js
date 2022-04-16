window.onload = () => {
    const startDate = document.getElementById("startDate");
    const endDate = document.getElementById("endDate");
    const button = document.getElementById("send");

    startDate.value = new Date().toISOString().substring(0, 10);
    endDate.value = new Date().toISOString().substring(0, 10);


    startDate.addEventListener("change", (event) => {
        const today = new Date();
        const date = startDate.valueAsDate;
        const endDateObject = endDate.valueAsDate;

        if(today < date) {
            alert("오늘보다 이전날짜를 선택해주세요");
            startDate.value = today.toISOString().substring(0, 10);
        }

        if(endDateObject < date){
            endDate.value = date.toISOString().substring(0, 10);
        }
    });

    endDate.addEventListener("change", (event) => {
        const today = new Date();
        const date = endDate.valueAsDate;

        if(today < date) {
            alert("오늘보다 이전날짜를 선택해주세요");
            endDate.value = today.toISOString().substring(0, 10);
        }
    });

    button.addEventListener("click", (event) => {
        const endDateObject = endDate.valueAsDate;
        const startDateObject = startDate.valueAsDate;

        if(endDateObject < startDateObject) {
            alert("시작날짜는 마지막날짜보다 과거로 설정해주세요.");
            return;
        }

        const differ = endDateObject - startDateObject;
        if((differ / (1000 * 3600 * 24)) > 365) {
            alert("1년 이상은 실행할 수 없습니다.");
            return;
        }

        fetch("/user/custom", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({startDate: startDate.value, endDate: endDate.value})
        }).then(() => {
            alert("잔디 심기가 요청되었습니다.");
            location.href="/list";
        })
    });
}