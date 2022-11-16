package com.ieung.receipt.dto.req;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Builder
@Getter
@Setter
@ToString(exclude = "password")
@NoArgsConstructor
@AllArgsConstructor
public class SignUpReqDTO {
    @NotBlank
    @Email(message = "이메일 형식에 맞지 않습니다.")
    @Schema(description = "이메일", required = true, example = "keep@receipt.com")
    private String email;

    @NotBlank
    @Pattern(regexp = "^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$", message = "비밀번호 형식에 맞지 않습니다.")
    @Schema(description = "비밀번호", required = true, example = "123456a!")
    private String password;

    @NotBlank
    @Schema(description = "이름", required = false, example = "영수증")
    private String name;
}
