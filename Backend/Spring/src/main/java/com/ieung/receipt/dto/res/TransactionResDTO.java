package com.ieung.receipt.dto.res;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResDTO {
    @Schema(description = "거래 내역 PK", example = "1")
    private Long transactionId;

    @Schema(description = "거래 날짜", example = "2022-05-01")
    private LocalDate date;

    @Schema(description = "금액", example = "15000")
    private int totalPrice;

    @Schema(description = "연관 영수증 청구 내역 id", example = "1")
    private Long requestId;

    @Schema(description = "영수증 이미지 url")
    private String receiptUrl;

    @Schema(description = "세부 거래 항목", required = true)
    private List<TransactionDetailResDTO> items;
}
