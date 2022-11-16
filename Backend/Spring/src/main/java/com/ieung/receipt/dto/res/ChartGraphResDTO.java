package com.ieung.receipt.dto.res;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ChartGraphResDTO {
    @Schema(description = "년")
    private int year;

    @Schema(description = "월")
    private int month;

    @Schema(description = "총 거래금액")
    private int totalCost;
}
