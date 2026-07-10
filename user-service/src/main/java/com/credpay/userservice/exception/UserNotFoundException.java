package com.credpay.userservice.exception;

/** Thrown when an operation references a user id that does not exist. */
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
