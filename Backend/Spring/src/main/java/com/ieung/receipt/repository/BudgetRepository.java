package com.ieung.receipt.repository;

import com.ieung.receipt.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long>, BudgetRepoCommon {
}
