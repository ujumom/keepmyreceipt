package com.ieung.receipt.entity;

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
@Table(name = "assetscategory")

//자산 소분류 테이블
public class AssetSCategory {
    // 자산 소분류 고유번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assetsc_id")
    private Long ascId;

    // 동아리
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "club_id")
    private Club club;

    // 대분류 이름
    @Column(name = "lcName")
    private String lcName;

    // 자산 소분류 이름
    @Column(name = "ascName")
    private String ascName;

    // 잔액
    @Column(name = "")
    private int balance;

    public void updateASC(AssetSCategory uAssetSCategory){
        this.lcName = uAssetSCategory.getLcName();
        this.ascName = uAssetSCategory.getAscName();
        this.balance = uAssetSCategory.getBalance();
    }

    public void updateBalance(int balance){
        this.balance = balance;
    }
}
