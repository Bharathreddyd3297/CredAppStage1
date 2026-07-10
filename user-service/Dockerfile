# =====================================================================
# CREDPAY User Service - production multi-stage Dockerfile
# Spring Boot 3.5.x / Java 21
# =====================================================================

# ---------------------------------------------------------------------
# Stage 1: BUILD - compile and package the executable JAR with Maven
# ---------------------------------------------------------------------
FROM maven:3.9-eclipse-temurin-21 AS build

# Working directory for the build
WORKDIR /build

# Copy ONLY pom.xml first so dependency resolution is cached as its own
# layer. Source changes won't re-trigger a full dependency download.
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Now copy the source and build the JAR (tests skipped for image build)
COPY src ./src
RUN mvn -B clean package -DskipTests

# ---------------------------------------------------------------------
# Stage 2: RUNTIME - minimal JRE image, no Maven, no source, no cache
# ---------------------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine AS runtime

# Create a dedicated non-root user/group and run as it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy ONLY the executable fat JAR produced in the build stage
COPY --from=build /build/target/*.jar app.jar

# Drop privileges
USER appuser

# Documents the port the app listens on (8080)
EXPOSE 8080

# Exec-form entrypoint: java is PID 1 and receives OS signals directly
ENTRYPOINT ["java", "-jar", "app.jar"]
