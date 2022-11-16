package com.ieung.receipt.repository;

import com.ieung.receipt.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.YearMonth;

public interface AssetRepository extends JpaRepository<Asset, Long>, AssetRepoCommon {
}
