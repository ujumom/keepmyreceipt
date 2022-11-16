package com.ieung.receipt.dto.req;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Builder
@Getter
@Setter
@ToString(exclude = "password")
@NoArgsConstructor
@AllArgsConstructor
public class LoginReqDTO {
    @NotBlank
    @Email(message = "이메일 형식에 맞지 않습니다.")
    @Schema(description = "이메일", required = true, example = "keep@receipt.com")
    private String email;

    @NotBlank
    @Schema(description = "비밀번호", required = true, example = "123456a!")
    private String password;

    @NotBlank
    @Schema(description = "FCM 토큰", required = true, example = "fm8hrEvUQs2H-PrwTmag2_:APA91bG2xqy35-ANXmVDCTW4tfUKKXFLrH-lxF_c9ap7dNocj_ri-" +
                                                                 "TRLzh8nE8XirQuEk-8D3tp1b3nfmPT61tYpSqvbrsjCYJA89tIboXxvo099SCXg_tWWaAjZlrpigc0MRjowfdK8")
    private String fcmToken;
}
