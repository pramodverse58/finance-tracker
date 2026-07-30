package com.financetracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Document(collection = "budgets")
@CompoundIndex(name = "idx_user_cat_month", def = "{'userId': 1, 'category': 1, 'month': 1}", unique = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Budget {

    @Id
    private String id;

    private String userId;

    private String category;

    /** Format: yyyy-MM, e.g. 2026-07 */
    private String month;

    private BigDecimal limitAmount;
}
