from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.prediction_routes import router as prediction_router

app = FastAPI(title="AgriNova Crop Recommendation API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(prediction_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

@app.get("/")
async def root():
    return {"message": "Welcome to AgriNova Crop Recommendation API"}
