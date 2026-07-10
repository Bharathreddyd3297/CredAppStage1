"""Pydantic request/response schemas.

Field names use camelCase to match the JSON contract exactly, so no aliasing
is required.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PaymentRequest(BaseModel):
    userId: int
    cardId: int
    amount: float = Field(gt=0, description="Payment amount, must be > 0")
    upiId: str = Field(min_length=3)


class PaymentResponse(BaseModel):
    transactionId: str
    status: str
    amount: float


class PaymentHistoryItem(BaseModel):
    # from_attributes lets us build directly from SQLAlchemy rows
    model_config = ConfigDict(from_attributes=True)

    transactionId: str
    amount: float
    status: str
    createdAt: datetime
