# Commands

```bash
curl -X POST "http://localhost:8000/face-recognition" \
  -F "img1=@../img/1.jpg" \
  -F "img2=@../img/2.jpg"
```

```bash
curl -X POST "http://localhost:8000/ocr-extract" \
  -F "file=@../img/uni.jpg"
```

```bash
curl -X POST "http://localhost:8000/id-verify" \
  -F "id_card=@img/uni.jpg" \
  -F "selfie=@img/1.jpg"
```
