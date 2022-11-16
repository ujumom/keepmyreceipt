package com.ieung.receipt.entity;

import com.vladmihalcea.hibernate.type.basic.YearMonthDateType;
import com.vladmihalcea.hibernate.type.basic.YearMonthIntegerType;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.YearMonth;

@Builder
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "asset")
@TypeDef(
        typeClass = YearMonthIntegerType.class,
        defaultForType = YearMonth.class
)
// 자산현황표 테이블
public class Asset {
    // 자산현황표 고유 키 값
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "asset_id")
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

    // 자산 소분류 이름
    @Column(name = "ascName")
    private String ascName;

    // 잔액
    @Column(nullable = false)
    private Integer balance;

    public void updateBalance(int balance) {
        this.balance = balance;
    }

    public Asset copyAsset(LocalDate localDate) {
        YearMonth date = YearMonth.of(localDate.getYear(), localDate.getMonth());
        return Asset.builder()
                .club(club)
                .date(date)
                .type(type)
                .lcName(lcName)
                .ascName(ascName)
                .balance(balance)
                .build();
    }
}
