FROM openjdk:8-jdk

WORKDIR /server

COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src

COPY ./build/libs/receipt-0.0.1-SNAPSHOT.jar spring.jar 

ENTRYPOINT ["java", "-jar", "spring.jar"]