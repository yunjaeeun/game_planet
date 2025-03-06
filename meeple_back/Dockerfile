# Meeple Backend Dockerfile

FROM openjdk:17-jdk-alpine

WORKDIR /app

COPY build/libs/meeple_back.jar meeple_back.jar

EXPOSE 8090

CMD ["java", "-jar", "meeple_back.jar"]