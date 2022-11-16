package com.ieung.receipt.entity;

import com.ieung.receipt.dto.res.TransactionDetailResDTO;
import com.ieung.receipt.dto.res.TransactionDetailSimpleResDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.time.LocalDate;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transaction_detail")
public class TransactionDetail {
    // 상세 거래 내역 고유 키값
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_detail_id")
    private Long id;

    // 연관된 거래 내역
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    // 지불 날짜
    @Column(nullable = false)
    private LocalDate payDate;

    // 상세 항목명
    @Column(length = 255, nullable = false)
    private String name;

    // 가격
    @Column(nullable = false)
    private Integer price;

    // 연관된 부모 태그
    @Column
    private String largeTag;

    // 연관된 자식 태그
    @Column
    private String smallTag;

    // 유형
    @Column(nullable = false)
    private String type;

    // 대분류
    @Column(nullable = false)
    private String largeCategory;

    // 소분류
    @Column(nullable = false)
    private String smallCategory;

    // 메모
    @Column(length = 255)
    private String memo;

    public void updateSmallTag(String smallTag) {
        this.smallTag = smallTag;
    }

    public void updateLargeTag(String largeTag) {
        this.largeTag = largeTag;
    }

    public void updateCategory(String largeCategory, String smallCategory) {
        this.largeCategory = largeCategory;
        this.smallCategory = smallCategory;
    }

    public TransactionDetailSimpleResDTO toTransactionDetailSimpleResDTO() {
        return TransactionDetailSimpleResDTO.builder()
                .transactionDetailId(id)
                .transactionId(transaction.getId())
                .date(payDate.toString())
                .largeTag(largeTag)
                .smallTag(smallTag)
                .name(name)
                .price(price)
                .build();
    }

    public TransactionDetailResDTO toTransactionDetailResDTO() {
        return TransactionDetailResDTO.builder()
                .transactionDetailId(id)
                .name(name)
                .price(Math.abs(price))
                .type(type)
                .largeCategory(largeCategory)
                .smallCategory(smallCategory)
                .largeTag(largeTag)
                .smallTag(smallTag)
                .memo(memo)
                .build();
    }
}
