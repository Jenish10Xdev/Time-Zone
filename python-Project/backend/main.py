from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import pytz
from pydantic import BaseModel
import re
from fastapi.responses import StreamingResponse
import asyncio
import json

app = FastAPI(title="TimezoneBuddy API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Common city to timezone mappings
CITY_TO_TIMEZONE = {
    "new york": "America/New_York",
    "los angeles": "America/Los_Angeles",
    "chicago": "America/Chicago",
    "london": "Europe/London",
    "paris": "Europe/Paris",
    "tokyo": "Asia/Tokyo",
    "sydney": "Australia/Sydney",
    "mumbai": "Asia/Kolkata",
    "delhi": "Asia/Kolkata",
    "kolkata": "Asia/Kolkata",
    "chennai": "Asia/Kolkata",
    "bangalore": "Asia/Kolkata",
    "hyderabad": "Asia/Kolkata",
    "ahmedabad": "Asia/Kolkata",
    "pune": "Asia/Kolkata",
    "jaipur": "Asia/Kolkata",
    "beijing": "Asia/Shanghai",
    "dubai": "Asia/Dubai",
    "singapore": "Asia/Singapore",
    "berlin": "Europe/Berlin",
    "moscow": "Europe/Moscow",
    "sao paulo": "America/Sao_Paulo",
    "mexico city": "America/Mexico_City",
    "johannesburg": "Africa/Johannesburg",
    "toronto": "America/Toronto",
    "istanbul": "Europe/Istanbul",
}

class TimeResponse(BaseModel):
    location: str
    timezone: str
    current_time: str
    utc_offset: str
    hour: int
    minute: int
    second: int

def get_timezone_from_location(location: str) -> str:
    # Convert to lowercase and remove extra spaces
    location = location.lower().strip()
    
    # Check if it's a direct timezone name
    if location in pytz.all_timezones:
        return location
    
    # Check if it's a city name
    if location in CITY_TO_TIMEZONE:
        return CITY_TO_TIMEZONE[location]
    
    # Try to find a matching timezone
    # First, try to match the city part of the timezone
    for tz in pytz.all_timezones:
        tz_lower = tz.lower()
        if location in tz_lower:
            return tz
    
    # If no match found, try to find a timezone that contains the location
    for city, tz in CITY_TO_TIMEZONE.items():
        if location in city:
            return tz
    
    raise ValueError("Timezone not found")

async def get_current_time(timezone_name: str, location: str):
    timezone = pytz.timezone(timezone_name)
    current_time = datetime.now(timezone)
    return TimeResponse(
        location=location,
        timezone=timezone.zone,
        current_time=current_time.strftime("%Y-%m-%d %H:%M:%S"),
        utc_offset=current_time.strftime("%z"),
        hour=current_time.hour,
        minute=current_time.minute,
        second=current_time.second
    )

@app.get("/time/{location}")
async def get_time(location: str):
    try:
        timezone_name = get_timezone_from_location(location)
        return await get_current_time(timezone_name, location)
    except (ValueError, pytz.exceptions.UnknownTimeZoneError):
        raise HTTPException(
            status_code=404,
            detail="Location not found. Please try a city name (e.g., 'New York') or timezone (e.g., 'America/New_York')"
        )

@app.get("/time-stream/{location}")
async def get_time_stream(location: str):
    try:
        timezone_name = get_timezone_from_location(location)
        
        async def generate():
            while True:
                time_data = await get_current_time(timezone_name, location)
                yield f"data: {json.dumps(time_data.dict())}\n\n"
                await asyncio.sleep(1)
        
        return StreamingResponse(generate(), media_type="text/event-stream")
    except (ValueError, pytz.exceptions.UnknownTimeZoneError):
        raise HTTPException(
            status_code=404,
            detail="Location not found. Please try a city name (e.g., 'New York') or timezone (e.g., 'America/New_York')"
        )

@app.get("/timezones")
async def get_available_timezones():
    return {
        "timezones": pytz.all_timezones,
        "cities": list(CITY_TO_TIMEZONE.keys())
    } 