import uvicorn

# uvicorn 실행을 위한 server 실행 파일
# host 0.0.0.0으로 서버에서 실행
# port 5555로 5555포트를 통해 접근 가능하도록 설정
# reload true로 코드가 변경되면 자동으로 reload 되도록 설정

if __name__ == '__main__' :
    uvicorn.run("app.main:app",
            host="0.0.0.0",
            port=5555,
            reload=True,
            #ssl_keyfile="./key.pem",
            #ssl_certfile="./cert.pem"
            )
