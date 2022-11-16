package com.ieung.receipt.entity;

import com.vladmihalcea.hibernate.type.basic.YearMonthIntegerType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.YearMonth;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "budget")
@TypeDef(
        typeClass = YearMonthIntegerType.class,
        defaultForType = YearMonth.class
)
// 예산운영표 테이블
public class Budget {
    // 예산운영표 고유 키 값
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "budget_id")
    private Long id;

    // 모임
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action= OnDeleteAction.CASCADE)
    @JoinColumn(name = "club_id")
    private Club club;

    // 연월
    @Column(nullable = false)
    private YearMonth date;

    // 유형
    @Column
    private String type;

    // 대분류 이름
    @Column(name = "lcName")
    private String lcName;

    // 예산 소분류 이름
    @Column(name = "bscName")
    private String bscName;

    // 현금 변동
    @Column(nullable = false)
    private Integer changes;

    public void updateChange(int change) {
        this.changes = changes;
    }

    public Budget copyBudget(LocalDate localDate) {
        YearMonth date = YearMonth.of(localDate.getYear(), localDate.getMonth());

        return Budget.builder()
                .club(club)
                .date(date)
                .type(type)
                .lcName(lcName)
                .bscName(bscName)
                .changes(changes)
                .build();

    }
}
