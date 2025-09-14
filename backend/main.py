from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
from enum import Enum

app = FastAPI(title="Quant Trading Calculator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Side(str, Enum):
    BUY = "BUY"
    SELL = "SELL"

class PreTradeRequest(BaseModel):
    pair: str
    leverage: float
    stop_loss_percent: float
    take_profit_percent: float
    balance: float
    side: Side = Side.BUY

class PostTradeRequest(PreTradeRequest):
    entry_price: float
    quantity: float

class PriceLevels(BaseModel):
    entry_price: float
    quantity: float
    stop_loss_price: float
    take_profit_price: float

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/calculate/pre-trade", response_model=PriceLevels)
async def calculate_pre_trade(request: PreTradeRequest):
    try:
        # TODO: Replace with actual calculation logic from crypto package
        # For now, returning hardcoded values
        entry_price = 100.0  # Example price
        quantity = (request.balance * request.leverage) / entry_price
        
        # Calculate SL and TP prices based on the side
        if request.side == Side.BUY:
            stop_loss_price = entry_price * (1 - request.stop_loss_percent / 100)
            take_profit_price = entry_price * (1 + request.take_profit_percent / 100)
        else:  # SELL
            stop_loss_price = entry_price * (1 + request.stop_loss_percent / 100)
            take_profit_price = entry_price * (1 - request.take_profit_percent / 100)
        
        return {
            "entry_price": round(entry_price, 4),
            "quantity": round(quantity, 4),
            "stop_loss_price": round(stop_loss_price, 4),
            "take_profit_price": round(take_profit_price, 4)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/calculate/post-trade", response_model=Dict[str, float])
async def calculate_post_trade(request: PostTradeRequest):
    try:
        # TODO: Replace with actual calculation logic from crypto package
        # For now, returning hardcoded values based on entry price and quantity
        if request.side == Side.BUY:
            stop_loss_price = request.entry_price * (1 - request.stop_loss_percent / 100)
            take_profit_price = request.entry_price * (1 + request.take_profit_percent / 100)
        else:  # SELL
            stop_loss_price = request.entry_price * (1 + request.stop_loss_percent / 100)
            take_profit_price = request.entry_price * (1 - request.take_profit_percent / 100)
        
        return {
            "stop_loss_price": round(stop_loss_price, 4),
            "take_profit_price": round(take_profit_price, 4)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
