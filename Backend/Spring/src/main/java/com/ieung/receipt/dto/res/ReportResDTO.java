package com.ieung.receipt.dto.res;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ReportResDTO {
    @Schema(description = "유형")
    private String type;

    @Schema(description = "대분류 리스트")
    private List<LargeCategoryResDTO> list;
}
