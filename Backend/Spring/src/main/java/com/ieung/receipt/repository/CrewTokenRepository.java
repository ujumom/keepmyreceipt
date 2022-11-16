package com.ieung.receipt.repository;

import com.ieung.receipt.entity.CrewToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CrewTokenRepository extends JpaRepository<CrewToken, Long>, CrewTokenRepoCommon {
    void deleteCrewTokensByFcmToken(String fcmToken);
}
