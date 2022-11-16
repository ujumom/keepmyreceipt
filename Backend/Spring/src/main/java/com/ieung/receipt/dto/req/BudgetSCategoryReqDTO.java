package com.ieung.receipt.dto.req;

import com.ieung.receipt.entity.BudgetSCategory;
import com.ieung.receipt.entity.Club;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class BudgetSCategoryReqDTO {
    // 대분류 이름
    @NotBlank
    @Schema(description = "대분류 이름", required = true)
    private String lcName;

    // 소분류 이름
    @NotBlank
    @Schema(description = "예산 소분류 이름", required = true)
    private String bscName;

    // 동아리 고유번호
    @NotNull
    @Schema(description = "소분류를 등록하고 사용하는 동아리의 고유번호", required = true)
    private Long clubId;

    public static BudgetSCategory toEntity(BudgetSCategoryReqDTO budgetSCategoryReqDTO, Club club){
        return BudgetSCategory.builder()
                .club(club)
                .bscName(budgetSCategoryReqDTO.getBscName())
                .lcName(budgetSCategoryReqDTO.getLcName())
                .build();
    }
}
