package com.financetracker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

public record BudgetRequest(
        @NotBlank(message = "Category is required") String category,
        @NotBlank(message = "Month is required")
        @Pattern(regexp = "\\d{4}-\\d{2}", message = "Month must be in yyyy-MM format")
        String month,
        @NotNull(message = "Limit amount is required")
        @DecimalMin(value = "0.01", message = "Limit must be greater than 0")
        BigDecimal limitAmount
) {}
