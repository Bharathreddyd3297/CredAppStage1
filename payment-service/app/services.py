"""Business logic for the payment service."""

from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import Card, Payment, User
from app.schemas import PaymentHistoryItem, PaymentRequest, PaymentResponse


def _generate_transaction_id(db: Session) -> str:
    """Build a unique transaction id like 'TXN20260624001'.

    Sequence is the count of today's transactions + 1, zero-padded to 3 digits.
    The transaction_id column is UNIQUE, so collisions would be rejected by the DB.
    """
    prefix = "TXN" + datetime.now().strftime("%Y%m%d")
    # Count rows matching today's prefix, then increment
    count = (
        db.query(Payment)
        .filter(Payment.transaction_id.like(f"{prefix}%"))
        .count()
    )
    return f"{prefix}{count + 1:03d}"


def create_payment(db: Session, request: PaymentRequest) -> PaymentResponse:
    # 1. Validate user exists
    user = db.get(User, request.userId)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User not found with id: {request.userId}",
        )

    # 2. Validate card exists
    card = db.get(Card, request.cardId)
    if card is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Card not found with id: {request.cardId}",
        )

    # 3. Generate unique transaction id
    transaction_id = _generate_transaction_id(db)

    # 4. Insert payment record with status SUCCESS
    payment = Payment(
        user_id=request.userId,
        card_id=request.cardId,
        amount=request.amount,
        upi_id=request.upiId,
        transaction_id=transaction_id,
        status="SUCCESS",
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    # 5. Return result
    return PaymentResponse(
        transactionId=payment.transaction_id,
        status=payment.status,
        amount=float(payment.amount),
    )


def get_payment_history(db: Session, user_id: int) -> list[PaymentHistoryItem]:
    # Confirm the user exists so an unknown id is a clear 404 rather than []
    if db.get(User, user_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User not found with id: {user_id}",
        )

    payments = (
        db.query(Payment)
        .filter(Payment.user_id == user_id)
        .order_by(Payment.created_at.desc())
        .all()
    )

    return [
        PaymentHistoryItem(
            transactionId=p.transaction_id,
            amount=float(p.amount),
            status=p.status,
            createdAt=p.created_at,
        )
        for p in payments
    ]
