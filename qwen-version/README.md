# ZKYC Qwen Version - AI-Powered KYC Verification

AI-powered KYC verification using Qwen2.5 Vision Language Model via Ollama for intelligent document text extraction and DeepFace for face recognition.

## 🚀 Features

- **AI-Powered Text Extraction**: Uses Qwen2.5 VLM to understand and extract text from ID documents
- **Face Recognition**: DeepFace integration for biometric verification
- **Docker Setup**: Complete containerized solution with Ollama
- **RESTful API**: FastAPI endpoints for easy integration
- **Automatic Model Management**: Qwen model downloads automatically

## 📋 Requirements

- Docker & Docker Compose
- At least 4GB RAM (recommended 8GB)
- 5GB free disk space (for model storage)

## 🛠️ Quick Start

### 1. Clone and Start Services

```bash
git clone <your-repo-url>
cd qwen-version
docker-compose up --build
```

### 2. Wait for Model Download

First startup takes 5-10 minutes as it downloads the Qwen2.5VL model (~2GB).

### 3. Check Health

```bash
curl "http://localhost:8000/health"
```

## 🔌 API Endpoints

### Health Check

```bash
curl "http://localhost:8000/health"
```

### AI Text Extraction

```bash
curl -X POST "http://localhost:8000/ai-extract" \
  -F "file=@your-document.jpg"
```

### Face Recognition

```bash
curl -X POST "http://localhost:8000/face-recognition" \
  -F "img1=@id-card.jpg" \
  -F "img2=@selfie.jpg"
```

### Complete KYC Verification

```bash
curl -X POST "http://localhost:8000/id-verify" \
  -F "id_card=@id-card.jpg" \
  -F "selfie=@selfie.jpg"
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   FastAPI       │    │     Ollama      │
│   (Port 8000)   │◄──►│   (Port 11434)  │
│                 │    │                 │
│ • Face Recognition   │ • Qwen2.5 VLM   │
│ • API Endpoints      │ • Model Management │
│ • File Processing    │ • AI Inference   │
└─────────────────┘    └─────────────────┘
```

## 🔧 Configuration

### Environment Variables

- `OLLAMA_BASE_URL`: Ollama service URL (default: http://localhost:11434)
- `PYTHONUNBUFFERED`: Python logging (default: 1)

### Model Configuration

- **Current Model**: `qwen2.5vl:1.5b` (faster, smaller)
- **Alternative**: `qwen2.5vl:3b` (slower, more accurate)

To change model, update `main.py`:

```python
QWEN_MODEL = "qwen2.5vl:3b"  # or "qwen2.5vl:1.5b"
```

## 📝 API Response Examples

### AI Extraction Response

```json
{
  "filename": "id-card.jpg",
  "prompt_used": "Extract all visible text...",
  "extracted_text": "Name: John Doe\nID: 123456789\nDate of Birth: 1990-01-01",
  "model": "qwen2.5vl:1.5b",
  "status": "success"
}
```

### KYC Verification Response

```json
{
  "verification_id": "20250705_120000",
  "face_verified": true,
  "face_confidence": 0.85,
  "extracted_info": "Name: John Doe\nID: 123456789...",
  "extraction_method": "AI-powered vision",
  "status": "success",
  "message": "AI-powered KYC verification completed successfully"
}
```

## 🗂️ File Structure

```
qwen-version/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── Dockerfile          # FastAPI container
├── docker-compose.yml  # Services orchestration
├── .gitignore          # Git ignore rules
├── README.md           # This file
├── uploads/            # Verification logs (auto-created)
└── ollama-data/        # Model storage (auto-created)
```

## 🚀 Deployment

### Production Considerations

1. **Resource Limits**: Set appropriate CPU/memory limits
2. **Persistent Storage**: Mount volumes for model persistence
3. **Security**: Add authentication and input validation
4. **Monitoring**: Add health checks and logging

### Docker Compose Production

```yaml
services:
  qwen-api:
    deploy:
      resources:
        limits:
          memory: 4G
        reservations:
          memory: 2G
```

## 🔄 Development

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run Ollama separately
ollama serve
ollama pull qwen2.5vl:1.5b

# Run FastAPI
python main.py
```

### Testing

```bash
# Run tests with sample images
curl -X POST "http://localhost:8000/ai-extract" \
  -F "file=@test-images/sample-id.jpg"
```

## 📊 Performance

- **Cold Start**: ~30 seconds (first request after startup)
- **Warm Inference**: ~3-5 seconds per request
- **Memory Usage**: ~2-4GB (depends on model size)
- **Concurrent Requests**: Limited by available memory

## 🛠️ Troubleshooting

### Common Issues

**Model Not Available**

```bash
# Check Ollama status
docker-compose logs ollama

# Manually pull model
docker-compose exec ollama ollama pull qwen2.5vl:1.5b
```

**Out of Memory**

```bash
# Use smaller model
QWEN_MODEL = "qwen2.5vl:1.5b"

# Or increase Docker memory limits
```

**Slow Performance**

- Use smaller model (1.5b vs 3b)
- Reduce concurrent requests
- Increase system memory

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 🔗 Related Projects

- [Ollama](https://ollama.ai/) - Local LLM runner
- [Qwen2.5-VL](https://github.com/QwenLM/Qwen2.5-VL) - Vision Language Model
- [DeepFace](https://github.com/serengil/deepface) - Face Recognition Library
- [FastAPI](https://fastapi.tiangolo.com/) - Web Framework
