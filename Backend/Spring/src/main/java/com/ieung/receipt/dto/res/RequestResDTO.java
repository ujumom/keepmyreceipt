package com.ieung.receipt.dto.res;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RequestResDTO {
    @Schema(description = "영수증 청구 요청 PK", example = "1")
    private long requestId;

    @Schema(description = "청구 회원 이름", example = "김수증")
    private String crewName;

    @Schema(description = "청구 금액", example = "15000")
    private int price;

    @Schema(description = "지불 날짜", example = "2022-02-03")
    private String payDate;

    @Schema(description = "영수증 이미지 url", example = "http://k6d104.p.ssafy.io:5555/images/20220507&H1145b84d1a341adcc87041b11b3e382348d3.jpg")
    private String receiptUrl;

    @Schema(description = "처리 상태", example = "신청/승인/거절")
    private String state;
}