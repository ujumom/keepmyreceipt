package com.ieung.receipt.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.*;
import com.ieung.receipt.code.YNCode;
import com.ieung.receipt.dto.notification.NotificationData;
import com.ieung.receipt.dto.notification.NotificationRequestDTO;
import com.ieung.receipt.repository.CrewTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.io.IOException;


@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PushService {
    private FirebaseApp firebaseApp;
    private final CrewTokenRepository crewTokenRepository;

    // application yml 설정파일에 설정한 값 사용
    @Value("${app.firebase-config}")
    private String firebaseConfig;

    @PostConstruct
    private void initialize() {
        try {
            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(new ClassPathResource(firebaseConfig).getInputStream())).build();

            if (FirebaseApp.getApps().isEmpty()) {
                this.firebaseApp = FirebaseApp.initializeApp(options);
            } else {
                this.firebaseApp = FirebaseApp.getInstance();
            }
        } catch (IOException e) {
            log.error("Create FirebaseApp Error", e);
        }
    }

    /**
     * fcm 토큰값으로 푸쉬 알림 전송
     * @param msgDTO
     */
    public String sendPushToDevice(NotificationRequestDTO msgDTO) {
        String response = null;

        try {
            if (msgDTO != null) {
                NotificationData notificationData = msgDTO.getNotification();

                Message message = Message.builder()
                        .setToken(msgDTO.getRegistration_ids())
                        .setNotification(Notification.builder()
                                .setTitle(notificationData.getTitle())
                                .setBody(notificationData.getBody()).build())

                        .setAndroidConfig(AndroidConfig.builder()
                                .setNotification(AndroidNotification.builder()
                                        .setClickAction(".src.main.MainActivity")
                                        .build())
                                .build())
                        .setWebpushConfig(WebpushConfig.builder()
                                .setFcmOptions(WebpushFcmOptions.builder()
                                        .setLink("https://k6d104.p.ssafy.io/alert")
                                        .build())
                                .build())
                        .build();

                response = FirebaseMessaging.getInstance().send(message);
            }
        } catch (Exception e) {
            // 만료된 토큰 삭제
            crewTokenRepository.deleteCrewTokensByFcmToken(msgDTO.getRegistration_ids());
        }

        return response;
    }
}
