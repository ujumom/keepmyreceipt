package com.ieung.receipt.repository;

import com.ieung.receipt.code.AuthCode;
import com.ieung.receipt.entity.ClubCrew;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubCrewRepository extends JpaRepository<ClubCrew, Long>, ClubCrewRepoCommon {
}
