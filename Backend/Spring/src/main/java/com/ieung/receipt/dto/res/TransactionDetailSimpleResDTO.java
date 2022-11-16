package com.ieung.receipt.dto.res;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDetailSimpleResDTO {
    @Schema(description = "상세 거래 내역 PK", example = "1")
    private Long transactionDetailId;

    @Schema(description = "연관 거래 내역 PK", example = "1")
    private Long transactionId;

    @Schema(description = "거래 날짜", example = "2022-05")
    private String date;

    @Schema(description = "항목명", example = "프리미엄 축구공")
    private String name;

    @Schema(description = "금액", example = "15000")
    private Integer price;

    @Schema(description = "1차 태그", example = "축구")
    private String largeTag;

    @Schema(description = "2차 태그", example = "축구공")
    private String smallTag;
}
