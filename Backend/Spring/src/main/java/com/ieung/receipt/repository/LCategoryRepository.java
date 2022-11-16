package com.ieung.receipt.repository;

import com.ieung.receipt.dto.res.LCategoryResDTO;
import com.ieung.receipt.entity.LCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LCategoryRepository extends JpaRepository<LCategory, Long> {
    List<LCategoryResDTO> findAllByLcType(String lcType);
}
