package com.financetracker.service;

import com.financetracker.dto.DashboardSummaryResponse;
import com.financetracker.model.Transaction;
import com.financetracker.model.TransactionType;
import com.financetracker.model.User;
import com.financetracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final DateTimeFormatter MONTH_FMT = DateTimeFormatter.ofPattern("yyyy-MM");

    private final TransactionRepository transactionRepository;

    public DashboardSummaryResponse getSummary(User user, String month) {
        YearMonth ym = YearMonth.parse(month, MONTH_FMT);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        List<Transaction> monthTransactions =
                transactionRepository.findByUserIdAndDateBetweenOrderByDateDesc(user.getId(), start, end);

        BigDecimal totalIncome = sum(monthTransactions, TransactionType.INCOME);
        BigDecimal totalExpense = sum(monthTransactions, TransactionType.EXPENSE);

        // Category breakdown for expenses
        Map<String, BigDecimal> byCategory = new LinkedHashMap<>();
        monthTransactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .forEach(t -> byCategory.merge(t.getCategory(), t.getAmount(), BigDecimal::add));

        List<DashboardSummaryResponse.CategoryBreakdown> categoryBreakdown = byCategory.entrySet().stream()
                .map(e -> DashboardSummaryResponse.CategoryBreakdown.builder()
                        .category(e.getKey()).amount(e.getValue()).build())
                .sorted(Comparator.comparing(DashboardSummaryResponse.CategoryBreakdown::getAmount).reversed())
                .toList();

        // Trailing 6-month trend
        List<DashboardSummaryResponse.MonthlyTrendPoint> trend = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth trendMonth = ym.minusMonths(i);
            List<Transaction> tMonthTxns = transactionRepository
                    .findByUserIdAndDateBetweenOrderByDateDesc(
                            user.getId(), trendMonth.atDay(1), trendMonth.atEndOfMonth());

            trend.add(DashboardSummaryResponse.MonthlyTrendPoint.builder()
                    .month(trendMonth.format(MONTH_FMT))
                    .income(sum(tMonthTxns, TransactionType.INCOME))
                    .expense(sum(tMonthTxns, TransactionType.EXPENSE))
                    .build());
        }

        return DashboardSummaryResponse.builder()
                .month(month)
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netBalance(totalIncome.subtract(totalExpense))
                .expenseByCategory(categoryBreakdown)
                .monthlyTrend(trend)
                .build();
    }

    private BigDecimal sum(List<Transaction> txns, TransactionType type) {
        return txns.stream()
                .filter(t -> t.getType() == type)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
