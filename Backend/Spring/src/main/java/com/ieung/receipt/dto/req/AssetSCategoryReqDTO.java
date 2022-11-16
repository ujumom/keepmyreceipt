package com.ieung.receipt.dto.req;

import com.ieung.receipt.entity.AssetSCategory;
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
public class AssetSCategoryReqDTO {
    // 동아리 고유번호
    @NotNull
    @Schema(description = "소분류를 등록하고 사용하는 동아리의 고유번호", required = true)
    private Long clubId;

    // 대분류 이름
    @NotBlank
    @Schema(description = "대분류 이름", required = true)
    private String lcName;

    // 소분류 이름
    @NotBlank
    @Schema(description = "자산 소분류 이름", required = true)
    private String ascName;

    // 잔액
    @NotNull
    @Schema(description = "자산의 잔액", required = true)
    private int balance;

    public static AssetSCategory toEntity(AssetSCategoryReqDTO assetSCategoryReqDTO, Club club){
        return AssetSCategory.builder()
                .club(club)
                .lcName(assetSCategoryReqDTO.getLcName())
                .ascName(assetSCategoryReqDTO.getAscName())
                .balance(assetSCategoryReqDTO.getBalance())
                .build();
    }
}
