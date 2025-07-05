# Build and run with Docker Compose

```bash
docker-compose up -d
```

# Testing the API

Test the POST endpoint:

```bash
curl -X POST http://localhost:8000/
```

Expected response:

```json
{
  "message": "Hello World",
  "method": "POST"
}
```

# Public package

```bash
# Build with new labels
docker build -t fastapi-hello .

# Tag with new version
docker tag fastapi-hello ghcr.io/tanguyvans/zkyc:0.2

# Push new version
docker push ghcr.io/tanguyvans/zkyc:0.2

# Also tag as latest
docker tag fastapi-hello ghcr.io/tanguyvans/zkyc:latest
docker push ghcr.io/tanguyvans/zkyc:latest
```

```bash
curl -X POST "http://localhost:8000/face-recognition" \
  -F "img1=@img/1.jpg" \
  -F "img2=@img/2.jpg"
```

# Face extraction using DeepFace
