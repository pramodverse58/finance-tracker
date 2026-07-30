package com.financetracker.dto;

import com.financetracker.model.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequest(
        @NotNull(message = "Type is required") TransactionType type,
        @NotBlank(message = "Category is required") String category,
        @NotNull(message = "Amount is required") @DecimalMin(value = "0.01", message = "Amount must be greater than 0") BigDecimal amount,
        @NotNull(message = "Date is required") LocalDate date,
        String note
) {}
