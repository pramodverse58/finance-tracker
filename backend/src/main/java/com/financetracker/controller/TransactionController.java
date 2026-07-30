package com.financetracker.controller;

import com.financetracker.dto.TransactionRequest;
import com.financetracker.dto.TransactionResponse;
import com.financetracker.model.User;
import com.financetracker.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAll(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {

        if (startDate != null && endDate != null) {
            return ResponseEntity.ok(transactionService.getByDateRange(user, startDate, endDate));
        }
        return ResponseEntity.ok(transactionService.getAll(user));
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> create(@AuthenticationPrincipal User user,
                                                       @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.create(user, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> update(@AuthenticationPrincipal User user,
                                                       @PathVariable String id,
                                                       @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.update(user, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal User user, @PathVariable String id) {
        transactionService.delete(user, id);
        return ResponseEntity.noContent().build();
    }
}
