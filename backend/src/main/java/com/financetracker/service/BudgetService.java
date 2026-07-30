package com.financetracker.service;

import com.financetracker.dto.BudgetRequest;
import com.financetracker.dto.BudgetStatusResponse;
import com.financetracker.exception.ResourceNotFoundException;
import com.financetracker.model.Budget;
import com.financetracker.model.TransactionType;
import com.financetracker.model.User;
import com.financetracker.repository.BudgetRepository;
import com.financetracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;

    public BudgetStatusResponse create(User user, BudgetRequest request) {
        budgetRepository.findByUserIdAndCategoryAndMonth(
                user.getId(), request.category().trim(), request.month())
                .ifPresent(b -> {
                    throw new IllegalArgumentException(
                            "A budget for this category already exists this month");
                });

        Budget budget = Budget.builder()
                .userId(user.getId())
                .category(request.category().trim())
                .month(request.month())
                .limitAmount(request.limitAmount())
                .build();

        return toStatus(budgetRepository.save(budget));
    }

    public BudgetStatusResponse update(User user, String id, BudgetRequest request) {
        Budget budget = budgetRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

        budget.setCategory(request.category().trim());
        budget.setMonth(request.month());
        budget.setLimitAmount(request.limitAmount());

        return toStatus(budgetRepository.save(budget));
    }

    public void delete(User user, String id) {
        budgetRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
        budgetRepository.deleteByIdAndUserId(id, user.getId());
    }

    public List<BudgetStatusResponse> getStatusForMonth(User user, String month) {
        return budgetRepository.findByUserIdAndMonth(user.getId(), month)
                .stream().map(this::toStatus).toList();
    }

    private BudgetStatusResponse toStatus(Budget budget) {
        YearMonth ym = YearMonth.parse(budget.getMonth(), DateTimeFormatter.ofPattern("yyyy-MM"));
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        // Sum expenses in this category for this month in Java (no custom SQL needed)
        BigDecimal spent = transactionRepository
                .findByUserIdAndTypeAndDateBetween(budget.getUserId(), TransactionType.EXPENSE, start, end)
                .stream()
                .filter(t -> t.getCategory().equalsIgnoreCase(budget.getCategory()))
                .map(t -> t.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal remaining = budget.getLimitAmount().subtract(spent);
        double percentUsed = budget.getLimitAmount().compareTo(BigDecimal.ZERO) == 0 ? 0
                : spent.divide(budget.getLimitAmount(), 4, RoundingMode.HALF_UP).doubleValue() * 100.0;

        return BudgetStatusResponse.builder()
                .id(budget.getId())
                .category(budget.getCategory())
                .month(budget.getMonth())
                .limitAmount(budget.getLimitAmount())
                .spentAmount(spent)
                .remainingAmount(remaining)
                .percentUsed(Math.round(percentUsed * 100.0) / 100.0)
                .overBudget(spent.compareTo(budget.getLimitAmount()) > 0)
                .build();
    }
}
