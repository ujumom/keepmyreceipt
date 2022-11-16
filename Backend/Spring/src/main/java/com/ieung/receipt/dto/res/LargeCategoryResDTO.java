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
public class LargeCategoryResDTO {
    @Schema(description = "대분류명")
    private String lcName;

    @Schema(description = "소분류 리스트")
    private List<SmallCategoryResDTO> list;
}