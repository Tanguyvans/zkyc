from fastapi import FastAPI

app = FastAPI()

@app.post("/")
async def post_root():
    return {"message": "Hello World", "method": "POST"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)