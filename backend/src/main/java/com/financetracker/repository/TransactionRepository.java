package com.financetracker.repository;

import com.financetracker.model.Transaction;
import com.financetracker.model.TransactionType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends MongoRepository<Transaction, String> {

    List<Transaction> findByUserIdOrderByDateDesc(String userId);

    Optional<Transaction> findByIdAndUserId(String id, String userId);

    List<Transaction> findByUserIdAndDateBetweenOrderByDateDesc(String userId, LocalDate start, LocalDate end);

    List<Transaction> findByUserIdAndTypeAndDateBetween(String userId, TransactionType type, LocalDate start, LocalDate end);

    void deleteByIdAndUserId(String id, String userId);
}
