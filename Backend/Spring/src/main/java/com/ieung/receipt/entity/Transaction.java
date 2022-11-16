package com.ieung.receipt.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transaction")
public class Transaction extends BaseEntity {
    // 거래 내역 고유 키값
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long id;

    // 연관된 모임
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "club_id")
    private Club club;

    // 지불 날짜
    @Column(nullable = false)
    private LocalDate payDate;

    // 총 금액
    @Column(nullable = false)
    private int price;

    // 승인자 crewId
    @Column(nullable = false)
    private Long approveCrewId;

    // 신청자 crewId
    @Column(nullable = false)
    private Long requestCrewId;

    // 연관된 청구 내역
    @OneToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "request_id")
    private Request request;

    // 연관된 상세 거래 내역 리스트
    @OneToMany(mappedBy = "transaction", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<TransactionDetail> transactionDetails;

    public void updatePrice(int price) {
        this.price = price;
    }

    public void updatePayDate(LocalDate payDate) {
        this.payDate = payDate;
    }
}
