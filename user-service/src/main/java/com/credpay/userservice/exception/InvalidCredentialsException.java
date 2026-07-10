package com.credpay.userservice.exception;

/** Thrown during login when the email is unknown or the password does not match. */
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
