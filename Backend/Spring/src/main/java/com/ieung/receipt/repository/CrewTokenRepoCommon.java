package com.ieung.receipt.repository;

import com.ieung.receipt.entity.CrewToken;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CrewTokenRepoCommon {
    // fcmToken으로 최근 로그인 내역 조회
    CrewToken findByFcmToken(String fcmToken);

    // crewId와 fcmToken으로 조회
    CrewToken findByCrewIdAndFcmToken(long crewId, String fcmToken);

    // crewId와 refreshToken으로 조회
    Optional<CrewToken> findByCrewIdAndRefreshToken(Long crewId, String refreshToken);

    List<CrewToken> findByCrewId(Long crewId);

    List<CrewToken> findLeaderByClubId(Long clubId);

    List<CrewToken> findLeaderOrManagerByClubId(Long clubId);
}
