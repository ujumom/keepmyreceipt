package com.ieung.receipt.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "budgetscategory")

// 예산 소분류 테이블
public class BudgetSCategory {
    // 예산 소분류 고유번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "budgetsc_id")
    private Long bscId;

    // 동아리
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "club_id")
    private Club club;

    // 대분류 이름
    @Column(name = "lcName")
    private String lcName;

    // 예산 소분류 이름
    @Column(name = "bscName")
    private String bscName;

    public void updateBSC(BudgetSCategory uBudgetSCategory){
        this.lcName = uBudgetSCategory.getLcName();
        this.bscName = uBudgetSCategory.bscName;
    }
}
