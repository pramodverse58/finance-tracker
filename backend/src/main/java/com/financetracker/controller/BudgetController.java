package com.financetracker.controller;

import com.financetracker.dto.BudgetRequest;
import com.financetracker.dto.BudgetStatusResponse;
import com.financetracker.model.User;
import com.financetracker.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping
    public ResponseEntity<List<BudgetStatusResponse>> getForMonth(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String month) {
        String targetMonth = (month == null || month.isBlank())
                ? YearMonth.now().toString() : month;
        return ResponseEntity.ok(budgetService.getStatusForMonth(user, targetMonth));
    }

    @PostMapping
    public ResponseEntity<BudgetStatusResponse> create(@AuthenticationPrincipal User user,
                                                        @Valid @RequestBody BudgetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(budgetService.create(user, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetStatusResponse> update(@AuthenticationPrincipal User user,
                                                        @PathVariable String id,
                                                        @Valid @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.update(user, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal User user, @PathVariable String id) {
        budgetService.delete(user, id);
        return ResponseEntity.noContent().build();
    }
}
