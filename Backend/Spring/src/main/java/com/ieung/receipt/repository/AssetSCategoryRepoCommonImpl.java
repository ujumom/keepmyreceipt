package com.ieung.receipt.repository;

import com.ieung.receipt.entity.QAssetSCategory;
import com.querydsl.jpa.impl.JPAQueryFactory;

import javax.persistence.EntityManager;

public class AssetSCategoryRepoCommonImpl implements AssetSCategoryRepoCommon {
    private final JPAQueryFactory queryFactory;
    private EntityManager em;

    public AssetSCategoryRepoCommonImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
        this.em = em;
    }

    @Override
    public void updateBalanceByClubIdAndLcNameAndAscName(Long clubId, String lcName, String ascName, int changes) {
        queryFactory.update(QAssetSCategory.assetSCategory)
                .set(QAssetSCategory.assetSCategory.balance, QAssetSCategory.assetSCategory.balance.add(changes))
                .where(QAssetSCategory.assetSCategory.club.id.eq(clubId),
                        QAssetSCategory.assetSCategory.lcName.eq(lcName),
                        QAssetSCategory.assetSCategory.ascName.eq(ascName))
                .execute();
    }
}
