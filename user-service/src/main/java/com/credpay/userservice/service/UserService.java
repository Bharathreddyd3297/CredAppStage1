package com.credpay.userservice.service;

import com.credpay.userservice.dto.LoginRequest;
import com.credpay.userservice.dto.RegisterRequest;
import com.credpay.userservice.entity.User;
import com.credpay.userservice.exception.EmailAlreadyExistsException;
import com.credpay.userservice.exception.InvalidCredentialsException;
import com.credpay.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    /**
     * Registers a new user. Email must be unique.
     *
     * NOTE: For this local capstone the password is stored as PLAIN TEXT in the
     * password_hash column. Replace with BCrypt hashing before any real deployment.
     *
     * @throws EmailAlreadyExistsException if the email is already taken
     */
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(request.getPassword()) // plain text for now
                .build();

        userRepository.save(user);
    }

    /**
     * Verifies email exists and the password matches the stored value.
     *
     * @return the authenticated user (for building the login response)
     * @throws InvalidCredentialsException if email is unknown or password is wrong
     */
    @Transactional(readOnly = true)
    public User login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!user.getPasswordHash().equals(request.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return user;
    }
}
