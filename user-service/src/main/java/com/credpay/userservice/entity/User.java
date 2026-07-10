package com.credpay.userservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

/**
 * Maps to the existing 'users' table created by schema.sql.
 * Columns: id, full_name, email, password_hash, created_at
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    // Maps to the password_hash column. For this local capstone the value is
    // stored as PLAIN TEXT (no hashing yet); secure with BCrypt later.
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    // Populated by the database DEFAULT NOW(); read-only from the app side.
    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}
