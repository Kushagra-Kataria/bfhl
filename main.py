from fastapi import FastAPI
from fastapi.responses import JSONResponse
from typing import List, Union, Dict
import math
import os
import requests
from dotenv import load_dotenv

# ---------------- ENV SETUP ---------------- #

load_dotenv()

OFFICIAL_EMAIL = os.getenv("OFFICIAL_EMAIL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app = FastAPI()

# ---------------- UTIL FUNCTIONS ---------------- #

def fibonacci(n: int):
    if n < 0:
        raise ValueError
    seq = []
    a, b = 0, 1
    for _ in range(n):
        seq.append(a)
        a, b = b, a + b
    return seq

def is_prime(num: int):
    if num < 2:
        return False
    for i in range(2, int(math.sqrt(num)) + 1):
        if num % i == 0:
            return False
    return True

def lcm_array(arr: List[int]):
    if len(arr) == 0:
        raise ValueError
    lcm_val = arr[0]
    for i in arr[1:]:
        lcm_val = abs(lcm_val * i) // math.gcd(lcm_val, i)
    return lcm_val

def hcf_array(arr: List[int]):
    if len(arr) == 0:
        raise ValueError
    hcf_val = arr[0]
    for i in arr[1:]:
        hcf_val = math.gcd(hcf_val, i)
    return hcf_val

def ai_answer(question: str):
    if not GEMINI_API_KEY:
        raise Exception("Gemini API key not loaded")

    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

    headers = {
        "Content-Type": "application/json"
    }

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": f"Answer the following question in ONE WORD ONLY. No punctuation, no explanation.\nQuestion: {question}"
                    }
                ]
            }
        ]
    }

    params = {
        "key": GEMINI_API_KEY
    }

    res = requests.post(url, headers=headers, json=payload, params=params, timeout=15)

    if res.status_code != 200:
        raise Exception("Gemini API error")

    text = res.json()["candidates"][0]["content"]["parts"][0]["text"]

    # 🔒 Hard enforcement: return only first word
    return text.strip().split()[0]
  # single-word response

# ---------------- API ENDPOINTS ---------------- #

@app.get("/health")
def health():
    return {
        "is_success": True,
        "official_email": OFFICIAL_EMAIL
    }

@app.post("/bfhl")
def bfhl(body: Dict[str, Union[int, List[int], str]]):
    try:
        # Must contain exactly one key
        if len(body) != 1:
            raise ValueError

        key, value = next(iter(body.items()))

        if key == "fibonacci":
            if not isinstance(value, int):
                raise ValueError
            data = fibonacci(value)

        elif key == "prime":
            if not isinstance(value, list):
                raise ValueError
            data = [x for x in value if is_prime(x)]

        elif key == "lcm":
            if not isinstance(value, list):
                raise ValueError
            data = lcm_array(value)

        elif key == "hcf":
            if not isinstance(value, list):
                raise ValueError
            data = hcf_array(value)

        elif key == "AI":
            if not isinstance(value, str):
                raise ValueError
            data = ai_answer(value)

        else:
            raise ValueError

        return {
            "is_success": True,
            "official_email": OFFICIAL_EMAIL,
            "data": data
        }

    except Exception:
        return JSONResponse(
            status_code=400,
            content={
                "is_success": False,
                "official_email": OFFICIAL_EMAIL,
                "data": None
            }
        )
