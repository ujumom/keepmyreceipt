package com.ieung.receipt.entity;

import com.ieung.receipt.code.NotiCode;
import com.ieung.receipt.code.YNCode;
import com.ieung.receipt.converter.NotiCodeConverter;
import com.ieung.receipt.converter.YNCodeConverter;
import com.ieung.receipt.dto.res.NotiResDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notification")
public class Notification extends BaseEntity {
    // 알림 고유 키값
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long id;

    // 회원
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action= OnDeleteAction.CASCADE)
    @JoinColumn(name = "crew_id")
    private Crew crew;

    // 알림 제목
    @Column(length = 255)
    private String title;

    // 알림 내용
    @Column(length = 255)
    private String body;

    // 알림 분류 코드
    @Convert(converter = NotiCodeConverter.class)
    @Column(nullable = false, length = 10)
    private NotiCode notiCode;

    // 알림과 연관된 clubId
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action= OnDeleteAction.CASCADE)
    @JoinColumn(name = "club_id")
    private Club club;

    // 알림과 연관된 청구 requestId
    @Column
    private Long requestId;

    // 알림 열람 여부
    @Convert(converter = YNCodeConverter.class)
    @Column(nullable = false, length = 1, columnDefinition = "varchar(1) default 'N'")
    private YNCode isRead;

    public void updateIsRead(YNCode isRead) {
        this.isRead = isRead;
    }

    public NotiResDTO toNotiResDTO() {
        return NotiResDTO.builder()
                .notificationId(id)
                .title(title)
                .body(body)
                .clubId(club.getId())
                .requestId(requestId)
                .date(getCreateDate())
                .isRead(isRead == YNCode.Y)
                .notiCode(notiCode.getValue())
                .build();
    }
}
