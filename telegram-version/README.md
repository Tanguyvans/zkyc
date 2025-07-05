# ZKYC Telegram Bot - AI-Powered KYC via Telegram

AI-powered KYC verification through a Telegram bot using Qwen2.5 Vision Language Model and DeepFace for intelligent document understanding and face recognition.

## 🤖 Features

- **📱 Mobile-First**: Easy KYC verification directly through Telegram
- **🔍 AI Text Extraction**: Extract text from ID documents using Qwen 2.5 VLM
- **👤 Face Recognition**: Compare faces between ID and selfie photos
- **🏛️ Complete KYC**: Full identity verification with detailed reports
- **🌐 Multi-Language**: Works with documents in multiple languages
- **⚡ Real-time**: Instant processing and responses via Telegram

## 🚀 Bot Commands & Features

### Main Features:

- **🔍 Extract Text from ID** - Upload any document for AI text extraction
- **👤 Face Recognition** - Compare two photos for face verification
- **🏛️ Full KYC Verification** - Complete identity verification process

### Bot Commands:

- `/start` - Show main menu with options
- `/help` - Display help and instructions
- `/cancel` - Cancel current operation

## 📱 How to Use

1. **Start the bot** - Send `/start` to begin
2. **Choose operation** - Select from the interactive menu
3. **Upload photos** - Send clear, well-lit images
4. **Get results** - Receive detailed AI-powered analysis

### Example Workflows:

#### 🔍 Document Text Extraction:

1. Tap "🔍 Extract Text from ID"
2. Upload your ID document photo
3. Get structured text extraction results

#### 👤 Face Recognition:

1. Tap "👤 Face Recognition"
2. Upload first photo (e.g., ID card)
3. Upload second photo (e.g., selfie)
4. Get face match verification results

#### 🏛️ Full KYC Verification:

1. Tap "🏛️ Full KYC Verification"
2. Upload ID card photo
3. Upload selfie photo
4. Get complete verification report

## 🛠️ Setup Instructions

### Prerequisites

- Docker & Docker Compose
- Telegram Bot Token (from @BotFather)
- 8GB RAM (recommended)
- 5GB disk space (for AI model)

### Step 1: Create Telegram Bot

1. **Message @BotFather** on Telegram
2. **Send** `/newbot`
3. **Choose bot name** (e.g., "My KYC Bot")
4. **Choose username** (e.g., "mykyc_bot")
5. **Copy the token** (looks like: `123456789:ABCdefGhIjKlMnOpQrStUvWxYz`)

### Step 2: Configure Environment

```bash
# Copy the environment template
cp env.example .env

# Edit .env file with your bot token
TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
```

### Step 3: Start the Services

```bash
# Build and start services
docker-compose up --build -d

# Wait for model download (first time: ~5 minutes)
docker-compose logs -f ollama

# Check bot status
docker-compose logs telegram-bot
```

### Step 4: Test Your Bot

1. **Find your bot** on Telegram (search for the username)
2. **Send** `/start`
3. **Try text extraction** with a sample document

## 🔧 Configuration

### Environment Variables

| Variable             | Description                             | Default               |
| -------------------- | --------------------------------------- | --------------------- |
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token from @BotFather | Required              |
| `OLLAMA_BASE_URL`    | Ollama service URL                      | `http://ollama:11434` |

### Model Configuration

- **Current Model**: `qwen2.5vl:3b` (high accuracy)
- **Alternative**: `qwen2.5vl:1.5b` (faster, smaller)

To change model, update `docker-compose.yml`:

```yaml
entrypoint:
  - /bin/bash
  - -c
  - "/bin/ollama serve & sleep 5; ollama pull qwen2.5vl:1.5b; wait"
```

## 📊 Performance

- **First startup**: ~5 minutes (downloads Qwen model)
- **Subsequent starts**: ~30 seconds
- **AI processing**: ~3-5 seconds per request
- **Face recognition**: ~1-2 seconds per comparison
- **Concurrent users**: Limited by available memory

## 🗂️ File Structure

```
telegram-version/
├── main.py              # Telegram bot application
├── requirements.txt     # Python dependencies
├── Dockerfile          # Bot container configuration
├── docker-compose.yml  # Services orchestration
├── env.example         # Environment template
├── README.md           # This file
└── .gitignore          # Git ignore rules
```

## 🐳 Docker Services

### Ollama Service

- **Purpose**: AI model server (Qwen 2.5 VLM)
- **Port**: 11434
- **Volume**: `ollama-data` (persistent model storage)

### Telegram Bot Service

- **Purpose**: Telegram bot interface
- **Dependencies**: Ollama service
- **Environment**: Bot token, Ollama URL

## 🔍 Bot Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Telegram      │    │  Telegram Bot   │    │     Ollama      │
│     User        │◄──►│   (Python)      │◄──►│   Qwen 2.5 VLM  │
│                 │    │                 │    │                 │
│ • Photo Upload  │    │ • Image Process │    │ • AI Inference  │
│ • Commands      │    │ • Face Compare  │    │ • Text Extract  │
│ • Get Results   │    │ • DeepFace      │    │ • Vision AI     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📱 Example Responses

### Text Extraction Result:

```
✅ Document Analysis Complete!

🔍 Extracted Information:
```

Name: John Doe
ID Number: ABC123456789
Date of Birth: January 1, 1990
Document Type: Driver's License
Nationality: US

```

🤖 Powered by Qwen 2.5 Vision Model
```

### KYC Verification Report:

```
🏛️ KYC VERIFICATION REPORT

Verification ID: 20250705_143022
Timestamp: 2025-07-05 14:30:22
Status: ✅ VERIFIED

📋 Extracted ID Information:
```

[Structured ID data]

```

👤 Face Verification:
• Match: YES
• Confidence: 87.5%
• Technical Score: 0.234

🤖 Verification Method: AI-powered analysis
```

## 🛠️ Troubleshooting

### Common Issues

**Bot not responding:**

```bash
# Check bot logs
docker-compose logs telegram-bot

# Restart bot service
docker-compose restart telegram-bot
```

**Model not available:**

```bash
# Check Ollama status
docker-compose logs ollama

# Manually pull model
docker-compose exec ollama ollama pull qwen2.5vl:3b
```

**Out of memory:**

- Use smaller model (`qwen2.5vl:1.5b`)
- Increase Docker memory limits
- Process one request at a time

### Error Messages

| Error                     | Solution                                     |
| ------------------------- | -------------------------------------------- |
| "Invalid bot token"       | Check `TELEGRAM_BOT_TOKEN` in `.env`         |
| "AI service error"        | Ensure Ollama is running and model is loaded |
| "Face recognition failed" | Use clear photos with visible faces          |

## 🔐 Security & Privacy

- **No data storage**: Images processed in memory only
- **Temporary files**: Auto-deleted after processing
- **Local processing**: All AI runs locally (no cloud API calls)
- **Bot token**: Keep your bot token secure and private

## 🚀 Production Deployment

### Resource Requirements

- **CPU**: 4+ cores recommended
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB for models and system
- **Network**: Stable internet for Telegram API

### Scaling Considerations

- Single bot instance handles multiple users
- Memory usage scales with concurrent requests
- Consider load balancing for high traffic

## 🔄 Development

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export TELEGRAM_BOT_TOKEN="your_token"
export OLLAMA_BASE_URL="http://localhost:11434"

# Run Ollama separately
ollama serve
ollama pull qwen2.5vl:3b

# Run bot
python main.py
```

### Testing

1. Create a test bot with @BotFather
2. Use the test token for development
3. Test with sample images

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Test with sample images
4. Submit a pull request

## 🔗 Related Projects

- [Ollama](https://ollama.ai/) - Local LLM runner
- [Qwen2.5-VL](https://github.com/QwenLM/Qwen2.5-VL) - Vision Language Model
- [DeepFace](https://github.com/serengil/deepface) - Face Recognition Library
- [python-telegram-bot](https://github.com/python-telegram-bot/python-telegram-bot) - Telegram Bot API

## 📞 Support

For issues and questions:

1. Check the troubleshooting section
2. Review Docker logs: `docker-compose logs`
3. Create an issue on GitHub

---

**🤖 Powered by Qwen 2.5 Vision Model + DeepFace + Telegram**
