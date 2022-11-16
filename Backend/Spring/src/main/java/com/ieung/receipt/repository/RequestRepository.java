package com.ieung.receipt.repository;

import com.ieung.receipt.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RequestRepository extends JpaRepository<Request, Long>, RequestRepoCommon {
}
