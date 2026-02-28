import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager

load_dotenv()

MONGO_DETAILS = os.getenv("MONGODB_URL")
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client["Agrinova"]

users = database["users"]
reset_otps = database["password_reset_otps"]
reset_limits = database["password_reset_limits"]

@asynccontextmanager
async def lifespan(app):
    print("✅ Connected to MongoDB!")

    await users.create_index("email", unique=True)
    await users.create_index("googleId", unique=True, sparse=True)
    await reset_otps.create_index("expiresAt", expireAfterSeconds=0)
    await reset_limits.create_index("userId", unique=True)
    await reset_limits.create_index("blockedUntil", expireAfterSeconds=0)

    yield

    client.close()
    print("❌ MongoDB connection closed.")