package com.ieung.receipt.repository;

import com.ieung.receipt.entity.Club;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubRepository extends JpaRepository<Club, Long>, ClubRepoCommon {
    Page<Club> findAll(Pageable pageable);
}
