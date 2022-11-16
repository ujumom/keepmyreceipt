package com.ieung.receipt.repository;

import com.ieung.receipt.entity.Budget;
import org.springframework.stereotype.Repository;

import java.time.YearMonth;
import java.util.List;

@Repository
public interface BudgetRepoCommon {
    void updateChangesInSameYearByClubIdAndLcNameAndBscNameAndDate(Long clubId,String lcName, String bscName, YearMonth date, int changes);
    void updateChangesByClubIdAndLcNameAndBscNameAndDate(Long clubId,String lcName, String bscName, YearMonth date, int changes);
    Boolean findExistByClubIdAndDate(Long clubId, YearMonth date); // 예산 운영표 존재 여부 확인
    List<Budget> findPostingBudgetsByClubIdAndDate(Long clubId, YearMonth date);
    boolean findExistByClubIdAndLcNameAndBscNameAndDate(Long clubId, String lcName, String scName, YearMonth date); // 해당 소분류 예산 운영표 존재 여부 확인
    List<YearMonth> findDateInSameYearByClubIdAndLcNameAndAscNameAndDate(Long clubId, String lcName, String scName, YearMonth date);
    List<Budget> findBudgetWithChangesByClubIdAndDate(Long clubId, YearMonth date);
}
