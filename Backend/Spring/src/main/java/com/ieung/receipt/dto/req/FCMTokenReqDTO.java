package com.ieung.receipt.dto.req;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import javax.validation.constraints.NotBlank;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class FCMTokenReqDTO {
    @NotBlank
    @Schema(description = "FCM 토큰", required = true, example = "fm8hrEvUQs2H-PrwTmag2_:APA91bG2xqy35-ANXmVDCTW4tfUKKXFLrH-lxF_c9ap7dNocj_ri-" +
            "TRLzh8nE8XirQuEk-8D3tp1b3nfmPT61tYpSqvbrsjCYJA89tIboXxvo099SCXg_tWWaAjZlrpigc0MRjowfdK8")
    private String fcmToken;
}
