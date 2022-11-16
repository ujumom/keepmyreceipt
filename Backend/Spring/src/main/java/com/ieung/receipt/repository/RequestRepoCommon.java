package com.ieung.receipt.repository;

import com.ieung.receipt.code.StateCode;
import com.ieung.receipt.entity.Request;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface RequestRepoCommon {
    Page<Request> findByClubId(Long clubId, Pageable pageable);
    Page<Request> findByClubIdAndCrewId(Long clubId, Long crewId, Pageable pageable);
    Page<Request> findByClubIdAndState(Long clubId, StateCode stateCode, Pageable pageable);
    Page<Request> findByClubIdAndCrewIdAndState(Long clubId, Long crewId, StateCode state, Pageable pageable);
    Optional<String> findReceiptUrlById(Long requestId);
}
