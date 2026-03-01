from fastapi import FastAPI
from config.database import lifespan
from fastapi.middleware.cors import CORSMiddleware
from routes.prediction_routes import router as prediction_router
from routes.auth_routes import router as auth_router
from routes.contact_routes import router as contact_router

app = FastAPI(title="AgriNova Crop Recommendation API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction_router)
app.include_router(auth_router)
app.include_router(contact_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

@app.get("/")
async def root():
    return {"message": "Welcome to AgriNova Crop Recommendation API"}