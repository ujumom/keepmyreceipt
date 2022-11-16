package com.ieung.receipt.repository;

import com.ieung.receipt.code.AuthCode;
import com.ieung.receipt.entity.ClubCrew;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubCrewRepoCommon {
    Optional<ClubCrew> findByClubIdAndCrewId(Long clubId, Long crewId); // 특정 모임 조회
    Optional<ClubCrew> findByClubIdAndCrewIdWithCrew(Long clubId, Long crewId); // 특정 모임 조회
    Long findCountByClubId(Long clubId); // 모임별 인원수 조회
    AuthCode findAuthCodeByClubIdAndCrewId(long clubId, long crewId); // 모임별 회원 권한 확인
    Boolean findExistByClubIdAndCrewId(Long clubId, Long crewId);    // 가입 여부 확인
    Page<ClubCrew> findAllByClubId(Long clubId, Pageable pageable);  // 모임별 모든 회원 조회
    Page<ClubCrew> findByClubIdAndAuthCode(Long clubId, AuthCode authCode, Pageable pageable);  // 권한별 회원 조회
    Page<ClubCrew> findRequestsByClubId(Long clubId, Pageable pageable); // 모임별 가입 신청 회원 조회
    Optional<ClubCrew> findByIdWithClub(Long clubCrewId); // club 정보와 함께 조회
    Boolean findExistLeaderByCrewId(long crewId); // 리더인 가입 내역이 있는지 확인
}






































