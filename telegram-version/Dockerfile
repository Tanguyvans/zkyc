FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the code
COPY . .

# Environment variables (TOKEN should be passed securely via .env or compose)
ENV TOKEN=changeme
ENV OLLAMA_BASE_URL=http://ollama:11434

# Set the entrypoint
CMD ["python", "main.py"]
