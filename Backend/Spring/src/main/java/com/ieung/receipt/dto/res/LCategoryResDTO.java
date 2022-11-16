package com.ieung.receipt.dto.res;

import com.ieung.receipt.entity.LCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class LCategoryResDTO {
    @Schema(description = "대분류 유형")
    private String lcType;

    @Schema(description = "대분류 이름")
    private String lcName;

    // Entity 형식을 Result 형식으로 변환
    public static LCategoryResDTO of(LCategory lCategory){
        return LCategoryResDTO.builder()
                .lcName(lCategory.getLcName())
                .lcType(lCategory.getLcType())
                .build();
    }
}
