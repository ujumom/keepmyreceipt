package com.ieung.receipt.repository;

import com.ieung.receipt.entity.TransactionDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Repository
public interface TransactionDetailRepoCommon {
    Page<TransactionDetail> findByContentOrTag(Long clubId, String query, LocalDate start, LocalDate end, Pageable pageable);
    List<TransactionDetail> findByPayDate(Long clubId, YearMonth yearMonth);
    int findIncomeByClubIdAndDateAndContentOrTag(Long clubId, String query, LocalDate start, LocalDate end);
    int findExpenditureByClubIdAndDateAndContentOrTag(Long clubId, String query, LocalDate start, LocalDate end);
}
