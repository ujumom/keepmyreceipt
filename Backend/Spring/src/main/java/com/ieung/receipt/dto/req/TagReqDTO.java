package com.ieung.receipt.dto.req;

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

public class TagReqDTO {
    //부모 태그
    @Schema(description = "부모 태그 이름, 1차 태그의 경우 생략")
    private String parentTag;

    //태그 이름
    @NotBlank
    @Schema(description = "태그 이름", required = true)
    private String tagName;

    //동아리 고유번호
    @NotNull
    @Schema(description = "태그를 등록하고 사용하는 동아리의 고유번호", required = true)
    private Long clubId;
}
