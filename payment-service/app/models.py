"""SQLAlchemy models mapping the existing credpay tables.

These tables already exist (created by schema.sql + migrations); the models
only describe the columns the payment-service needs. Nothing here creates or
alters the schema.
"""

from sqlalchemy import (
    BigInteger,
    DateTime,
    Numeric,
    SmallInteger,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    full_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(150))


class Card(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger)
    card_holder: Mapped[str] = mapped_column(String(100))
    card_number: Mapped[str] = mapped_column(String(25))
    card_network: Mapped[str | None] = mapped_column(String(20))
    expiry_month: Mapped[int] = mapped_column(SmallInteger)
    expiry_year: Mapped[int] = mapped_column(SmallInteger)


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger)
    card_id: Mapped[int | None] = mapped_column(BigInteger)
    amount: Mapped[float] = mapped_column(Numeric(12, 2))
    upi_id: Mapped[str] = mapped_column(String(100))
    transaction_id: Mapped[str | None] = mapped_column(String(30), unique=True)
    status: Mapped[str] = mapped_column(String(20), default="PENDING")
    created_at: Mapped["DateTime"] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
