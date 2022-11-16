package com.ieung.receipt.service;

import com.ieung.receipt.code.NotiCode;
import com.ieung.receipt.code.YNCode;
import com.ieung.receipt.config.security.JwtTokenProvider;
import com.ieung.receipt.dto.notification.NotificationData;
import com.ieung.receipt.dto.notification.NotificationRequestDTO;
import com.ieung.receipt.entity.Club;
import com.ieung.receipt.entity.Crew;
import com.ieung.receipt.entity.CrewToken;
import com.ieung.receipt.entity.Notification;
import com.ieung.receipt.exception.ApiMessageException;
import com.ieung.receipt.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PushService pushService;

    /**
     * 알림 하나 생성
     * @param notiCode, requestId, title, body, club, crewTokens
     */
    @Transactional(readOnly = false)
    public void createOneNotification(NotiCode notiCode, Long requestId, String title, String body, Club club, List<CrewToken> crewTokens) {
        if (crewTokens == null || crewTokens.size() == 0) {
            return;
        }

        Notification notification = Notification.builder()
                .title(title)
                .body(body)
                .crew(crewTokens.get(0).getCrew())
                .club(club)
                .notiCode(notiCode)
                .requestId(requestId)
                .isRead(YNCode.N)
                .build();

        notificationRepository.save(notification);

        // FCM 전송
        for (CrewToken crewToken : crewTokens) {
            if (crewToken.getFcmToken() != null && crewToken.getIsAllowedPush() == YNCode.Y
                    && jwtTokenProvider.validateToken(crewToken.getRefreshToken())) {
                pushService.sendPushToDevice(NotificationRequestDTO.builder()
                        .registration_ids(crewToken.getFcmToken())
                        .notification(NotificationData.builder()
                                .title(title)
                                .body(body)
                                .build())
                        .build());
            }
        }
    }

    /**
     * 알림 여러 개 생성
     * @param notiCode, requestId, title, body, club, crewTokens
     */
    @Transactional(readOnly = false)
    public void createManyNotifications(NotiCode notiCode, Long requestId, String title, String body, Club club, List<CrewToken> crewTokens) {
        if (crewTokens == null || crewTokens.size() == 0) {
            return;
        }

        Set<Long> crewIdSet = new HashSet<>();
        List<Notification> notifications = new ArrayList<>();

        for (CrewToken crewToken : crewTokens) {
            if (!crewIdSet.contains(crewToken.getCrew().getId())) {
                Notification notification = Notification.builder()
                        .title(title)
                        .body(body)
                        .crew(crewToken.getCrew())
                        .club(club)
                        .requestId(requestId)
                        .notiCode(notiCode)
                        .isRead(YNCode.N)
                        .build();

                notifications.add(notification);
                crewIdSet.add(crewToken.getCrew().getId());
            }
        }

        notificationRepository.saveAll(notifications);

        // FCM 전송
        for (CrewToken crewToken : crewTokens) {
            if (crewToken.getFcmToken() != null && crewToken.getIsAllowedPush() == YNCode.Y
                    && jwtTokenProvider.validateToken(crewToken.getRefreshToken())) {
                pushService.sendPushToDevice(NotificationRequestDTO.builder()
                        .registration_ids(crewToken.getFcmToken())
                        .notification(NotificationData.builder()
                                .title(title)
                                .body(body)
                                .build())
                        .build());
            }
        }
    }

    /**
     * 알림 조회
     * @param crewId, pageable
     * @return Page<Notification>
     */
    public Page<Notification> getNotifications(Long crewId, Pageable pageable) {
        return notificationRepository.findByCrewId(crewId, pageable);
    }

    /**
     * 알림 읽음 처리
     * @param crewId, pageable
     */
    @Transactional(readOnly = false)
    public void readNotification(Long crewId, long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ApiMessageException("해당하는 알림이 없습니다."));

        if (notification.getCrew().getId() == crewId) {
            notification.updateIsRead(YNCode.Y);
            notificationRepository.save(notification);
        } else {
            throw new AccessDeniedException("");
        }
    }

    /**
     * 알림 삭제
     * @param crewId, notificationId
     */
    @Transactional(readOnly = false)
    public void deleteNotification(Long crewId, long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ApiMessageException("해당하는 알림이 없습니다."));

        if (notification.getCrew().getId() == crewId) {
            notificationRepository.delete(notification);
        } else {
            throw new AccessDeniedException("");
        }
    }
}
