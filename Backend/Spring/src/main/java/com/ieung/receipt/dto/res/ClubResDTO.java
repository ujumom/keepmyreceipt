package com.ieung.receipt.dto.res;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.hibernate.validator.constraints.URL;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ClubResDTO {
    @Schema(description = "모임 번호", required = true, example = "1")
    private long id;

    @Schema(description = "모임 이름", required = true, example = "마이구미 축구 동호회")
    private String name;

    @Schema(description = "모임 설명", example = "구미 지역의 축구 동호회입니다.")
    private String description;

    @Schema(description = "모임 이미지", example = "http://k6d104.p.ssafy.io:5555/images/20220507&H1145b84d1a341adcc87041b11b3e382348d3.jpg")
    private String image;
}
