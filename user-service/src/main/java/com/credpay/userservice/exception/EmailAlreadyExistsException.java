package com.credpay.userservice.exception;

/** Thrown during registration when the email is already taken. */
public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String message) {
        super(message);
    }
}
