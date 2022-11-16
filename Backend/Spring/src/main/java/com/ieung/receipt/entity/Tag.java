package com.ieung.receipt.entity;

import com.ieung.receipt.dto.res.TagResDTO;
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
@Table(name = "tag")
// 태그 테이블
public class Tag {
    // 태그 고유 키 값
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tag_id")
    private long id;

    // 동아리 번호
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "club_id")
    private Club club;

    // 부모 태그
    @Column
    private String parentTag;

    // 태그명
    @Column(nullable = false)
    private String tagName;

    // 태그 레벨
    @Column
    private int tagLevel;

    public void updateTag(Tag uTag) {
        this.parentTag = uTag.getParentTag();
        this.tagName = uTag.getTagName();
        this.tagLevel = uTag.getTagLevel();
    }

    //Tag를 TagResDTO 객체로 변환
    public TagResDTO toTagResDTO(){
        return TagResDTO.builder()
                .tagId(this.id)
                .parentTag(this.parentTag)
                .tagName(this.tagName)
                .build();
    }
}
