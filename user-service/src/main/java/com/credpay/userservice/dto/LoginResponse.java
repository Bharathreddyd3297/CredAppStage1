package com.credpay.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Successful-login response body:
 * { "userId": 3, "fullName": "...", "email": "...", "message": "Login successful" }
 */
@Data
@AllArgsConstructor
public class LoginResponse {
    private Long userId;
    private String fullName;
    private String email;
    private String message;
}
