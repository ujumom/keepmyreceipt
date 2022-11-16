package com.ieung.receipt.dto.res;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ChartResDTO{
    @Schema(description = "태그 이름")
    private String tagName;

    @Schema(description = "퍼센티지")
    private int percentage;

    @Schema(description = "결제 금액")
    private int cost;

    @Schema(description = "총 금액")
    private int totalCost;

    public boolean equals(Object o){
        return this.tagName.equals(((ChartResDTO)o).getTagName());
    }
}
