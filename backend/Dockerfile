# Multi-stage Dockerfile for Spendora Backend

# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy files from backend directory if built from root, or current directory if built from backend
COPY . .

RUN if [ -d "backend" ]; then cd backend; fi && mvn package -DskipTests && cp target/spendora-backend-1.0.0.jar /app/app.jar

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S spendora && adduser -S spendora -G spendora
USER spendora:spendora
COPY --from=build /app/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
