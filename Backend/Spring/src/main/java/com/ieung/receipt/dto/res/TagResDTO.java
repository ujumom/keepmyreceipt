package com.ieung.receipt.dto.res;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor

public class TagResDTO {
    @Schema(description = "태그 고유번호", required = true)
    private Long tagId;

    @Schema(description = "부모태그 이름")
    private String parentTag;

    @Schema(description = "태그 이름", required = true)
    private String tagName;
}
