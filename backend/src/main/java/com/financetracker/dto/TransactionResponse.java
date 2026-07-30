package com.financetracker.dto;

import com.financetracker.model.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {
    private String id;          // String (MongoDB ObjectId)
    private TransactionType type;
    private String category;
    private BigDecimal amount;
    private LocalDate date;
    private String note;
}
