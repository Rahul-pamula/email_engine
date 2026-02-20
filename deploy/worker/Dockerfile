# ============================================================
# Email Engine — Background Worker (Email Sender)
# ============================================================
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies first (layer caching)
COPY platform/api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy API utils (shared code: supabase client, models, etc.)
COPY platform/api/ ./api/

# Copy worker source
COPY platform/services/ .

# Set Python path so worker can import from api/
ENV PYTHONPATH="/app/api"

# Start the worker
CMD ["python", "worker.py"]
