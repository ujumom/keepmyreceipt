package com.ieung.receipt.dto.res;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RequestSimpleResDTO {
    @Schema(description = "영수증 청구 요청 PK", example = "1")
    private long requestId;

    @Schema(description = "청구 회원 이름", example = "김수증")
    private String crewName;

    @Schema(description = "청구 금액", example = "15000")
    private int price;

    @Schema(description = "처리 상태", example = "신청/승인/거절")
    private String state;
}
