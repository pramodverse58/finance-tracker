package com.financetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String tokenType;
    private String userId;      // String (MongoDB ObjectId)
    private String fullName;
    private String email;
    private long expiresInMs;
}
