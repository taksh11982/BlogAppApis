FROM eclipse-temurin:17-jdk-alpine as build
WORKDIR /app
COPY block-app-api/.mvn .mvn
COPY block-app-api/mvnw block-app-api/pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B
COPY block-app-api/src src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
