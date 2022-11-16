package com.ieung.receipt.repository;

import com.ieung.receipt.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, TransactionRepoCommon {
}
