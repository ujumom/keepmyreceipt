package com.ieung.receipt.dto.res;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class NotiResDTO {
    @Schema(description = "알림 PK", example = "1")
    private Long notificationId;

    @Schema(description = "알림 제목", example = "가입 요청 알림")
    private String title;

    @Schema(description = "알림 내용", example = "영수증님이 모임 가입을 요청하였습니다.")
    private String body;

    @Schema(description = "알림 시각", example = "2022-05-06 12:04:21")
    private LocalDateTime date;

    @Schema(description = "알림 분류 코드", example = "가입/청구")
    private String notiCode;

    @Schema(description = "알림 열람 여부 (true : 읽음, false : 읽지 않음)", example = "false")
    private boolean isRead;

    @Schema(description = "연관 모임 id", example = "1")
    private Long clubId;

    @Schema(description = "청구 요청 내역 id (알림 분류 코드가 청구일 때만)", example = "1")
    private Long requestId;
}
