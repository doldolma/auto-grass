# 자동 잔디 심기 서비스

[링크](https://jandi.doldolma.com)



GitHub에서 Oauth APP 등록, callback 등록 /user/callback

.env 파일에 DB 정보, Clitent ID, Client Secret 등록

사용법
```
npm install
npm run start
```

- Docker
```
docker build -t auto-grass .
docker run -p "4000:4000" auto-grass
```

### 잔디 확인 및 자동잔디 등록/해제
![image](https://user-images.githubusercontent.com/16643184/161436397-cb81b32f-cd21-444a-8513-46ce29953fda.png)

### 날짜 범위 내 잔디 심기
![image](https://user-images.githubusercontent.com/16643184/161436432-87742686-8a35-410d-aae9-7adf86fda8b2.png)
