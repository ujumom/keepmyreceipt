package com.ieung.receipt.dto.req;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TokenReqDTO {
    @Schema(description = "accessToken", required = true, example = "123")
    private String accessToken;

    @Schema(description = "refreshToken", required = true, example = "123")
    private String refreshToken;
}
