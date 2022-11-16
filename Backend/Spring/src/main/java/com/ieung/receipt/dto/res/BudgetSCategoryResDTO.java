package com.ieung.receipt.dto.res;

import com.ieung.receipt.entity.BudgetSCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class BudgetSCategoryResDTO {
    @Schema(description = "예산 소분류 고유번호")
    private Long bscId;

    @Schema(description = "예산 소분류 이름")
    private String bscName;

    public static BudgetSCategoryResDTO of(BudgetSCategory budgetSCategory){
        return BudgetSCategoryResDTO.builder()
                .bscId(budgetSCategory.getBscId())
                .bscName(budgetSCategory.getBscName())
                .build();
    }
}
