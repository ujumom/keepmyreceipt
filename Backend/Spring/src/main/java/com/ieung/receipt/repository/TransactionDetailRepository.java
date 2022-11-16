package com.ieung.receipt.repository;

import com.ieung.receipt.entity.Transaction;
import com.ieung.receipt.entity.TransactionDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionDetailRepository extends JpaRepository<TransactionDetail, Long>, TransactionDetailRepoCommon {
}
