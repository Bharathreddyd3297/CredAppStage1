# =====================================================================
# CREDPAY Payment Service - production Dockerfile
# Python 3.14 / FastAPI / SQLAlchemy / Uvicorn
# =====================================================================

# Lightweight Python base (Debian slim): small, stable, and ships the
# system libs that the prebuilt psycopg/uvicorn wheels need.
FROM python:3.14-slim

# Sensible Python runtime flags:
#  - no .pyc files written (smaller, cleaner container)
#  - unbuffered stdout/stderr so logs appear immediately in `docker logs`
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Working directory for the application
WORKDIR /app

# Copy ONLY requirements first so the dependency-install layer is cached
# and is NOT rebuilt when application source changes.
COPY requirements.txt .

# Install dependencies without keeping pip's download cache in the image.
RUN pip install --no-cache-dir -r requirements.txt

# Now copy the application source (the `app/` package)
COPY app ./app

# Database configuration via environment variables (overridable at runtime).
# Non-sensitive defaults are set here for local development.
# DB_PASSWORD is intentionally NOT baked into the image (secrets must not live
# in image layers); the app defaults it to "postgres" for local dev, and it
# should be supplied at runtime (-e DB_PASSWORD=... / secret) in production.
ENV DB_USERNAME=postgres \
    DB_HOST=localhost \
    DB_PORT=5432 \
    DB_NAME=credpay

# Create and switch to a non-root user (never run the app as root)
RUN useradd --create-home --uid 1001 appuser
USER appuser

# Documents the port Uvicorn listens on (does not publish it)
EXPOSE 8000

# Start Uvicorn directly as PID 1 (exec form). No --reload in production.
ENTRYPOINT ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
