package com.ieung.receipt.entity;

import com.ieung.receipt.code.AuthCode;
import com.ieung.receipt.code.StateCode;
import com.ieung.receipt.converter.AuthCodeConverter;
import com.ieung.receipt.converter.StateCodeConverter;
import com.ieung.receipt.dto.res.ClubCrewResDTO;
import com.ieung.receipt.dto.res.CrewReqsResDTO;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "club_crew")
public class ClubCrew extends BaseEntity {
    // 모임별 회원 고유 키값
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "club_crew_id")
    private Long id;

    // 모임
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action= OnDeleteAction.CASCADE)
    @JoinColumn(name = "club_id")
    private Club club;

    // 회원
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action= OnDeleteAction.CASCADE)
    @JoinColumn(name = "crew_id")
    private Crew crew;

    // 회원별 권한
    @Convert(converter = AuthCodeConverter.class)
    @Column(nullable = false, length = 10, columnDefinition = "varchar(10)")
    private AuthCode auth;

    public void updateAuth(AuthCode auth) {
        this.auth = auth;
    }

    public CrewReqsResDTO toCrewReqsResDTO() {
        return CrewReqsResDTO.builder()
                .clubCrewId(id)
                .name(crew.getName())
                .email(crew.getEmail())
                .build();
    }

    public ClubCrewResDTO toClubCrewResDTO() {
        return ClubCrewResDTO.builder()
                .clubCrewId(id)
                .name(crew.getName())
                .email(crew.getEmail())
                .auth(auth.getValue())
                .build();
    }
}
