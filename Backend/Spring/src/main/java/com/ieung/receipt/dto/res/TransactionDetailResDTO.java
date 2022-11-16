package com.ieung.receipt.dto.res;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.springframework.format.annotation.NumberFormat;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDetailResDTO {
    @Schema(description = "상세 거래 내역 PK", example = "1")
    private Long transactionDetailId;

    @Schema(description = "항목명", example = "축구공")
    private String name;

    @Schema(description = "금액", example = "15000")
    private Integer price;

    @Schema(description = "유형", example = "자산")
    private String type;

    @Schema(description = "대분류", example = "유형자산")
    private String largeCategory;

    @Schema(description = "소분류", example = "비품")
    private String smallCategory;

    @Schema(description = "1차 태그", example = "축구")
    private String largeTag;

    @Schema(description = "2차 태그", example = "축구공")
    private String smallTag;

    @Schema(description = "메모", example = "부회장이 고름")
    private String memo;
}
