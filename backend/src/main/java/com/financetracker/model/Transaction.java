package com.financetracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Document(collection = "transactions")
@CompoundIndex(name = "idx_user_date", def = "{'userId': 1, 'date': -1}")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    private String id;

    private String userId;

    private TransactionType type;

    private String category;

    private BigDecimal amount;

    private LocalDate date;

    private String note;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
