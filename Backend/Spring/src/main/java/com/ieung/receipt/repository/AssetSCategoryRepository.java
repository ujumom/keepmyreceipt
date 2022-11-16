package com.ieung.receipt.repository;

import com.ieung.receipt.dto.res.AssetSCategoryResDTO;
import com.ieung.receipt.entity.AssetSCategory;
import com.ieung.receipt.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssetSCategoryRepository extends JpaRepository<AssetSCategory, Long>, AssetSCategoryRepoCommon {
    // 소분류 중복 검사
    int countByClubAndLcNameAndAscName(Club club, String lcName, String ascName);
    // 소분류 조회
    List<AssetSCategoryResDTO> findAllByClubAndLcName(Club club, String lcName);
    // 특정 소분류 조회
    Optional<AssetSCategory> findAssetSCategoryByClubAndLcNameAndAscName(Club club, String lcName, String ascNAme);
}
