package com.ieung.receipt.repository;

import com.ieung.receipt.entity.Crew;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CrewRepository extends JpaRepository<Crew, Long>, CrewRepoCommon {
}
