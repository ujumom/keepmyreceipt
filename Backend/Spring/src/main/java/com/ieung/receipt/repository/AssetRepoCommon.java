package com.ieung.receipt.repository;

import com.ieung.receipt.entity.Asset;
import org.springframework.stereotype.Repository;

import java.time.YearMonth;
import java.util.List;

@Repository
public interface AssetRepoCommon {
    List<YearMonth> findDateByClubIdAndLcNameAndAscNameAndDate(Long clubId, String lcName, String ascName, YearMonth date);
    void updateBalanceByClubIdAndLcNameAndAscNameAndDate(Long clubId,  String lcName, String ascName, YearMonth date, int changes);
    Boolean findExistByClubIdAndDate(Long clubId, YearMonth date); // 자산 현황표 존재 여부 확인
    List<Asset> findLatestAssetsByClubIdAndDate(Long clubId, YearMonth date); // 날짜 기준 가장 최신 날짜의 자산 현황표 조회
    Boolean findExistByClubIdAndLcNameAndAscNameAndDate(Long clubId, String lcName, String ascName, YearMonth date); // 자산 현황표 존재 여부 확인
    List<Asset> findAssetWithBalanceByClubIdAndDate(Long clubId, YearMonth date); // 날짜 기준 잔액이 있는 자산 현황표 조회
}
