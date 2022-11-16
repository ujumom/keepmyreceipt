package com.ieung.receipt.dto.res;

import com.ieung.receipt.entity.AssetSCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AssetSCategoryResDTO {
    @Schema(description = "자산 소분류 고유번호")
    private Long ascId;

    @Schema(description = "자산 소분류 이름")
    private String ascName;

    @Schema(description = "잔액")
    private int balance;

    public static AssetSCategoryResDTO of(AssetSCategory assetSCategory){
        return AssetSCategoryResDTO.builder()
                .ascId(assetSCategory.getAscId())
                .ascName(assetSCategory.getAscName())
                .balance(assetSCategory.getBalance())
                .build();
    }
}
