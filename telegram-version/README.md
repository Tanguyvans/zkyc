# ZKYC Telegram Bot - Docker Setup

This is a containerized version of the ZKYC Telegram Bot that provides AI-powered KYC verification using Qwen 2.5 Vision Language Model.

## Features

- 🔍 **Text Extraction** - Extract text from ID documents using AI
- 👤 **Face Recognition** - Compare faces between two photos
- 🏛️ **KYC Verification** - Complete identity verification process
- 🧠 **Powered by Qwen 2.5 Vision Model** for intelligent document understanding

## Prerequisites

- Docker and Docker Compose installed
- Telegram Bot Token from [@BotFather](https://t.me/BotFather)

## Setup Instructions

### 1. Get Telegram Bot Token

1. Start a chat with [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the bot token (format: `123456789:AAGax-vgGmQsRiwf4WIQI4xq8MMf4WaQI5x`)

### 2. Environment Setup

Create a `.env` file in the `telegram-version` directory:

```bash
# Copy the example and edit
cp .env.example .env

# Edit with your bot token
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

### 3. Start the Services

```bash
# Build and start all services
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f telegram-bot
docker-compose logs -f ollama
```

### 4. Install Qwen Model

The first time you run the setup, you need to install the Qwen 2.5 Vision model:

```bash
# Install the model in Ollama
docker-compose exec ollama ollama pull qwen2.5vl:3b

# Verify the model is installed
docker-compose exec ollama ollama list
```

### 5. Test the Bot

1. Find your bot on Telegram using the username you created
2. Send `/start` to begin using the bot
3. Choose from the available KYC verification options

## Services

### Telegram Bot

- **Container**: `zkyc-telegram-bot`
- **Port**: None (connects to Telegram API)
- **Dependencies**: Ollama service

### Ollama (AI Model Server)

- **Container**: `ollama`
- **Port**: `11434` (exposed for debugging)
- **Model**: Qwen 2.5 Vision Language Model (3B parameters)

## Usage

The bot provides three main features:

1. **Text Extraction**: Upload a document image to extract text
2. **Face Recognition**: Compare two photos for face matching
3. **Full KYC Verification**: Complete identity verification process

## Troubleshooting

### Bot not responding

```bash
# Check bot logs
docker-compose logs telegram-bot

# Restart the bot
docker-compose restart telegram-bot
```

### Ollama connection issues

```bash
# Check Ollama status
docker-compose exec ollama ollama list

# Restart Ollama
docker-compose restart ollama

# Pull the model again if needed
docker-compose exec ollama ollama pull qwen2.5vl:3b
```

### Model not found

```bash
# Install the required model
docker-compose exec ollama ollama pull qwen2.5vl:3b
```

## Development

To modify the bot:

1. Edit `main.py`
2. Rebuild the container:
   ```bash
   docker-compose build telegram-bot
   docker-compose up -d telegram-bot
   ```

## Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears model data)
docker-compose down -v
```

## Security Notes

- Keep your bot token secure and never commit it to version control
- The bot processes sensitive identity documents - ensure proper security measures
- Use environment variables for sensitive configuration

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Telegram      │    │   Bot Container │    │ Ollama Container│
│   Users         │◄──►│   (Python)      │◄──►│ (Qwen 2.5 VLM)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

The bot receives images from Telegram users, processes them using the Qwen 2.5 Vision Language Model running in Ollama, and returns structured results for KYC verification.
