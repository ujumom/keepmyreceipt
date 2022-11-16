package com.ieung.receipt.repository;

import org.springframework.stereotype.Repository;

@Repository
public interface AssetSCategoryRepoCommon {
    void updateBalanceByClubIdAndLcNameAndAscName(Long clubId, String lcName, String ascName, int changes);
}
