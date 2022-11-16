package com.ieung.receipt.dto.res;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class SmallCategoryResDTO {
    @Schema(description = "소분류명")
    private String scName;

    @Schema(description = "금액")
    private int balance;
}