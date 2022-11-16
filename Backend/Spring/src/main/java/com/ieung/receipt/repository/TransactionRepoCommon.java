package com.ieung.receipt.repository;

import com.ieung.receipt.entity.Transaction;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransactionRepoCommon {
    Optional<Transaction> findTransactionByIdWithTransactionDetails(Long id);
}
