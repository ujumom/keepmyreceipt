package com.ieung.receipt.entity;

import com.ieung.receipt.code.StateCode;
import com.ieung.receipt.converter.StateCodeConverter;
import com.ieung.receipt.dto.req.RequestReqDTO;
import com.ieung.receipt.dto.res.RequestResDTO;
import com.ieung.receipt.dto.res.RequestSimpleResDTO;
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
@Table(name = "request")
public class Request extends BaseEntity {
    // 영수증 청구 신청 내역 고유 키값
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long id;

    // 연관된 모임
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "club_id")
    private Club club;

    // 신청자
    @Column(nullable = false)
    private Long crewId;

    // 신청자 이름
    @Column(nullable = false, length = 64)
    private String crewName;

    // 지불 날짜
    @Column(nullable = false)
    private LocalDate payDate;

    // 금액
    @Column(nullable = false)
    private int price;

    // 영수증 이미지 url
    @Column(length = 255)
    private String receiptUrl;

    // 상태 코드
    @Convert(converter = StateCodeConverter.class)
    @Column(nullable = false, length = 10, columnDefinition = "varchar(10) default '신청'")
    private StateCode state;

    public void updateState(StateCode state){
        this.state = state;
    }

    public void updatePayDate(LocalDate localDate) {
        this.payDate = payDate;
    }

    public void updatePrice(int price) {
        this.price = price;
    }

    public void updateReceiptUrl(String receiptUrl) {
        this.receiptUrl = receiptUrl;
    }

    public void updateRequest(RequestReqDTO requestReqDTO) {
        this.price = requestReqDTO.getPrice();
        this.payDate = requestReqDTO.getDate();
        this.receiptUrl = requestReqDTO.getReceiptUrl();
    }

    public RequestSimpleResDTO toRequestSimpleResDTO() {
        return RequestSimpleResDTO.builder()
                .requestId(id)
                .crewName(crewName)
                .price(price)
                .state(state.getValue())
                .build();
    }

    public RequestResDTO toRequestResDTO() {
        return RequestResDTO.builder()
                .requestId(id)
                .crewName(crewName)
                .price(price)
                .state(state.getValue())
                .payDate(payDate.toString())
                .receiptUrl(receiptUrl)
                .build();
    }
}
