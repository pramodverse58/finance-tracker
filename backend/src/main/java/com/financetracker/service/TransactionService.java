package com.financetracker.service;

import com.financetracker.dto.TransactionRequest;
import com.financetracker.dto.TransactionResponse;
import com.financetracker.exception.ResourceNotFoundException;
import com.financetracker.model.Transaction;
import com.financetracker.model.User;
import com.financetracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public List<TransactionResponse> getAll(User user) {
        return transactionRepository.findByUserIdOrderByDateDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    public List<TransactionResponse> getByDateRange(User user, LocalDate start, LocalDate end) {
        return transactionRepository.findByUserIdAndDateBetweenOrderByDateDesc(user.getId(), start, end)
                .stream().map(this::toResponse).toList();
    }

    public TransactionResponse create(User user, TransactionRequest request) {
        Transaction transaction = Transaction.builder()
                .userId(user.getId())
                .type(request.type())
                .category(request.category().trim())
                .amount(request.amount())
                .date(request.date())
                .note(request.note())
                .build();
        return toResponse(transactionRepository.save(transaction));
    }

    public TransactionResponse update(User user, String id, TransactionRequest request) {
        Transaction transaction = transactionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        transaction.setType(request.type());
        transaction.setCategory(request.category().trim());
        transaction.setAmount(request.amount());
        transaction.setDate(request.date());
        transaction.setNote(request.note());

        return toResponse(transactionRepository.save(transaction));
    }

    public void delete(User user, String id) {
        transactionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        transactionRepository.deleteByIdAndUserId(id, user.getId());
    }

    private TransactionResponse toResponse(Transaction t) {
        return TransactionResponse.builder()
                .id(t.getId())
                .type(t.getType())
                .category(t.getCategory())
                .amount(t.getAmount())
                .date(t.getDate())
                .note(t.getNote())
                .build();
    }
}
