# from fastapi import FastAPI
# from fastapi.responses import JSONResponse
# from typing import List, Union, Dict
import math
import os
import requests
from dotenv import load_dotenv

load_dotenv()

# ✅ FIRST load env vars
OFFICIAL_EMAIL = os.getenv("OFFICIAL_EMAIL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# ✅ THEN print
print("GEMINI KEY LOADED:", bool(GEMINI_API_KEY))

# app = FastAPI()
