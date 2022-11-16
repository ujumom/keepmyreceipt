package com.ieung.receipt.dto.notification;

import lombok.*;
import org.springframework.stereotype.Service;


@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Data
public class NotificationRequestDTO {
    private String registration_ids; // 수신자
    private NotificationData notification;
}
