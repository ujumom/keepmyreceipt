package com.ieung.receipt.dto.req;

import com.ieung.receipt.entity.LCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import javax.validation.constraints.NotBlank;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class LCategoryReqDTO {
    //대분류 유형
    @NotBlank
    @Schema(description = "대분류 유형(자산, 예산, 지출, 수입)")
    private String lcType;

    //대분류 이름
    @NotBlank
    @Schema(description = "태그 이름", required = true)
    private String lcName;

    // request 형식을 Entity로 변환
    public static LCategory toEntity(LCategoryReqDTO lCategoryReqDTO){
        return LCategory.builder()
                .lcType(lCategoryReqDTO.getLcType())
                .lcName(lCategoryReqDTO.getLcName())
                .build();
    }
}
