package com.ieung.receipt.service;

import com.ieung.receipt.code.AuthCode;
import com.ieung.receipt.entity.Asset;
import com.ieung.receipt.entity.Budget;
import com.ieung.receipt.exception.ApiMessageException;
import com.ieung.receipt.repository.AssetRepository;
import com.ieung.receipt.repository.BudgetRepository;
import com.ieung.receipt.repository.ClubCrewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {
    private final AssetRepository assetRepository;
    private final BudgetRepository budgetRepository;
    private final ClubCrewRepository clubCrewRepository;

    /**
     * 해당 달에 맞는 자산 현황표 조회
     * @param clubId, crewId
     */
    public List<Asset> getAsset(Long clubId, Long crewId, YearMonth date) {
        checkAuth(clubId, crewId);

        return assetRepository.findAssetWithBalanceByClubIdAndDate(clubId, date);
    }


    /**
     * 회원 여부 확인
     * @param clubId, crewId
     */
    public void checkAuth(long clubId, long crewId) {
        AuthCode authCode = clubCrewRepository.findAuthCodeByClubIdAndCrewId(clubId, crewId);

        if (authCode == null || authCode == AuthCode.NONE) {
            throw new ApiMessageException("모임에 가입된 회원이 아닙니다.");
        }
    }

    public List<Budget> getBudget(Long clubId, Long crewId, YearMonth date) {
        checkAuth(clubId, crewId);

        return budgetRepository.findBudgetWithChangesByClubIdAndDate(clubId, date);
    }
}
