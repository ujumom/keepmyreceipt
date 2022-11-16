package com.ieung.receipt.entity;

import com.ieung.receipt.code.YNCode;
import com.ieung.receipt.converter.YNCodeConverter;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "crew_token")
public class CrewToken {
    // 회원별 토큰 고유 키값
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "crew_token_id")
    private long id;

    // 회원
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action= OnDeleteAction.CASCADE)
    @JoinColumn(name = "crew_id")
    private Crew crew;

    // 리프레시 토큰
    @Column(length = 255)
    private String refreshToken;

    // 장비 푸시용 토큰
    @Column(length = 255, name = "fcm_token")
    private String fcmToken;

    // 푸시 알림 설정 (Y:on, N:off)
    @Convert(converter = YNCodeConverter.class)
    @Column(nullable = false, length = 1, columnDefinition = "varchar(1) default 'Y'")
    private YNCode isAllowedPush;

    public void updateIsAllowedPush(YNCode isAllowedPush){
        this.isAllowedPush = isAllowedPush;
    }

    public void updateRefreshToken(String refreshToken){
        this.refreshToken = refreshToken;
    }

    public void updateFcmToken(String fcmToken){
        this.fcmToken = fcmToken;
    }
}
