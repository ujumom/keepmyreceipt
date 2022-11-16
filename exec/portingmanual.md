## **Development Environment**

- 작성 날짜: 2022-05-20
- CPU: Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz RAM: 16.0 GB
- Ubuntu: 20.04 LTS (GNU/Linux 5.4.0-1018-aws x68_64)
    - Docker: 20.10.12
    - Docker Compose: 2.1.0
    - Nginx: 1.18.0
- Backend
    - Intellij: 2021.3.1
    - Java JDK: v17.0.2
    - Spring: 2.6.7
    - Mysql: 8.0.27
- Backend (AI)
    - Pycharm
    - Python
    - FastAPI
- Frontend (Web)
    - React: 18.1.0
    - Typescript: 4.6.3
    - Visual Studio Code: 1.67.0
- Frontend (Android)
    - Android Studio: 2021.1.1
    - Kotlin: 1.6.10
    - Android Gradle: 7.0.4

# **Port**

- Nginx: 80
- Spring Boot: 8185
- FastAPI: 5555
- React: 3000
- jenkins: 8000

# **MySQL**

```
# MySQL 설치
sudo apt-get update
sudo apt-get install mysql-server
sudo ufw allow mysql
sudo systemctl start mysql
sudo systemctl enable mysql

# MySQL 접속
sudo mysql -u root -p
```

> MySQL 계정
> 
> 
> ```
> username: receipt
> password: Receipt!*
> ```
> 

## **Nginx**

```
# Nginx 설치
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install nginx

# Nginx 설정 파일 삭제 후 재설정
rm /etc/nginx/nginx.conf
vi /etc/nginx/nginx.conf
```

```
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    client_max_body_size 0;

    server {
        listen       80;
        server_name {도메인};
        keepalive_timeout 5;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen       443 default_server ssl;
        server_name  {도메인};

        ssl_certificate      /etc/letsencrypt/live/{도메인}/fullchain.pem;
        ssl_certificate_key  /etc/letsencrypt/live/{도메인}/privkey.pem;
        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;

        location / {
             proxy_set_header X-Forwarded-For             $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto https;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header HOST $http_host;
             proxy_set_header X-NginX-Proxy true;

             proxy_pass http://{도메인}:3000;
             proxy_redirect off;
        }

        location /api/spring {
             proxy_set_header X-Forwarded-For             $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto https;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header HOST $http_host;
             proxy_set_header X-NginX-Proxy true;

             proxy_pass http://{도메인}:8185;
        }

        location /fast {
             proxy_set_header X-Forwarded-For             $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto https;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header HOST $http_host;
             proxy_set_header X-NginX-Proxy true;

             proxy_pass http://{도메인}:5555;
        }

        error_page 500 502 503 504 /50x.html;
        location = 50x.html {
                root /usr/share/nginx/html;
        }
   }
}

```

```
# certbot 인증서 발급
sudo systemctl stop nginx
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository universe
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
sudo nginx -t
sudo service nginx reload

sudo certbot --nginx -d {도메인}
```

# **Jenkins**

```
# Jenkins 설치
sudo apt install -y openjdk-8-jdk
sudo apt install -y nginx
wget -q -O - https://pkg.jenkins.io/debian/jenkins-ci.org.key | sudo apt-key add -
echo deb http://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys FCEF32E745F2C3D5
sudo apt-get update -y
sudo apt-get install -y jenkins

# Jenkins 설정 변경
sudo vi /etc/default/jenkins
```

```
# 8000번으로 변경
HTTP_PORT=8000
```

```
# Jenkins 서비스 재기동
sudo service jenkins restart
sudo systemctl status jenkins
```

- pipeline 설정

```
pipeline {
    agent any
    options {
        timeout(time: 1, unit: 'HOURS')
    }
    environment {
        SOURCECODE_JENKINS_CREDENTIAL_ID = '{id}' // Gitlab과 연동할때 쓴 credential Id
        SOURCE_CODE_URL = '{Git 주소}'
        RELEASE_BRANCH = 'develop'
    }
    stages {
        stage('Init') {
            steps {
                echo 'clear'
                deleteDir()
            }
        }

        stage('clone') {
            steps {
                git url: "$SOURCE_CODE_URL",
                    branch: "$RELEASE_BRANCH",
                    credentialsId: "$SOURCECODE_JENKINS_CREDENTIAL_ID"
                sh "ls -al"
            }
        }

        stage('frontend dockerizing') {
            steps {
                dir("./Frontend/React/keep_my_receipt"){
                    sh "docker build -t frontend ."
                }

            }
        }

        stage('backend dockerizing') {
            steps {
                sh "pwd"

                dir("./Backend/Spring"){
                    sh "pwd"
                    sh "echo $GRADLE_HOME"
                    sh "echo $PATH"
                    sh 'chmod +x gradlew'
                    sh './gradlew bootJar'
                    sh "docker build -t backend/spring ."
                }
            }
        }

        stage('deploy') {
            steps {
                sh '''
                  docker stop frontend
                  docker stop backend
                  docker rm frontend
                  docker rm backend
                  docker run -d --name frontend -p 3000:3000 frontend
                  docker run -d --name backend -p 8185:8185 backend/spring
                '''
            }
        }
    }
}
```

# Docker

```
# Docker 설치
sudo apt-get update

sudo apt-get -y install \
			apt-transport-https \
			ca-certificates \
			curl \
			gnupg \
			lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io
```

- image 다운로드

```
# Spring backend 이미지 다운로드
sudo docker pull seojiwon335/keep_my_receipt:spring

# FastAPI backend 이미지 다운로드
sudo docker pull seojiwon335/keep_my_receipt:fastapi

# react frontend 이미지 다운로드
sudo docker pull seojiwon335/keep_my_receipt:react
```

- 컨테이너 실행

```
# Spring backend 컨테이너 실행
sudo docker run -p 8185:8185 -d seojiwon335/keep_my_receipt:spring

# FastAPI backend 컨테이너 실행
sudo docker run -p 5555:5555 -d seojiwon335/keep_my_receipt:fastapi

# react frontend 컨테이너 실행
sudo docker run -p 3000:3000 -d seojiwon335/keep_my_receipt:react
```
