package com.ieung.receipt.repository;

import com.ieung.receipt.entity.Club;
import com.ieung.receipt.entity.ClubCrew;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClubRepoCommon {
    Page<Club> findAllByName(String name, Pageable pageable);
    Page<Club> findJoinedClubByCrewId(Long crewId, Pageable pageable); // 회원별 가입 모임 조회
    Page<Club> findRequestedClubByCrewId(Long crewId, Pageable pageable); // 회원별 가입 요청 모임 조회
}






































