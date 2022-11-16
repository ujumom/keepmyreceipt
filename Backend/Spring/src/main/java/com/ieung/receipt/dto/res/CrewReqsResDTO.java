package com.ieung.receipt.dto.res;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CrewReqsResDTO {
    @Schema(description = "모임별 회원 PK", example = "1")
    private long clubCrewId;

    @Schema(description = "회원 이름", example = "김수증")
    private String name;

    @Schema(description = "회원 이메일",example = "keep@receipt.com")
    private String email;
}
