package com.ieung.receipt.entity;

import com.ieung.receipt.code.YNCode;
import com.ieung.receipt.converter.YNCodeConverter;
import com.ieung.receipt.dto.res.ClubResDTO;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "club")
// 모임 테이블
public class Club {
    // 모임 고유 키 값
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "club_id")
    private long id;

    // 모임 이름
    @Column(nullable = false, length = 64)
    private String name;

    // 모임 소개
    @Column(length = 255)
    private String description;

    // 모임 이미지
    @Column(length = 255)
    private String image;

    // 대분류 사용 여부
    @Convert(converter = YNCodeConverter.class)
    @Column(nullable = false, length = 1, columnDefinition = "varchar(1) default 'Y'")
    private YNCode isActiveCategory;

    public void updateName(String name) {
        this.name = name;
    }

    public void updateDescription(String description) {
        this.description = description;
    }

    public void updateImage(String image) {
        this.image = image;
    }

    public void updateIsActiveCategory(YNCode isActiveCategory) {
        this.isActiveCategory = isActiveCategory;
    }

    // Club을 ClubResDTO 객체로 변환
    public ClubResDTO toClubResDTO() {
        return ClubResDTO.builder()
                .id(id)
                .name(name)
                .description(description)
                .image(image)
                .build();
    }
}
