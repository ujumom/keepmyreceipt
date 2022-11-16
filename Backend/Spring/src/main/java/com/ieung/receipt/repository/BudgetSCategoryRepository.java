package com.ieung.receipt.repository;

import com.ieung.receipt.dto.res.BudgetSCategoryResDTO;
import com.ieung.receipt.entity.BudgetSCategory;
import com.ieung.receipt.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetSCategoryRepository extends JpaRepository<BudgetSCategory,Long> {
    // 소분류 중복검사
    int countByClubAndLcNameAndBscName(Club club, String lcName, String bscName);
    // 소분류 조회
    List<BudgetSCategoryResDTO> findAllByClubAndLcName(Club club, String lcName);
    // 특정 소분류 조회
    Optional<BudgetSCategory> findBudgetSCategoryByClubAndLcNameAndBscName(Club club, String lcName, String bscName);
}
