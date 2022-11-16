package com.ieung.receipt.entity;

import com.ieung.receipt.dto.res.LCategoryResDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "lcategory")

// 대분류 테이블
public class LCategory {
    // 대분류 고유 키 값
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lcategory_id")
    private long lcId;

    // 대분류 유형(자산, 예산, 지출, 수입)
    @Column(nullable = false)
    private String lcType;

    // 대분류 이름
    @Column(nullable = false)
    private String lcName;
}
