package com.ieung.receipt.repository;

import com.ieung.receipt.entity.Asset;
import com.ieung.receipt.entity.QAsset;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.YearMonth;
import java.util.List;

@Slf4j
@Repository
@Transactional
public class AssetRepoCommonImpl implements AssetRepoCommon {
    private final JPAQueryFactory queryFactory;
    private EntityManager em;

    public AssetRepoCommonImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
        this.em = em;
    }

    @Override
    public List<YearMonth> findDateByClubIdAndLcNameAndAscNameAndDate(Long clubId, String lcName, String ascName, YearMonth date) {
        // 해당 소분류가 존재하지 않는 공백 계산
        YearMonth yearMonth = queryFactory.select(QAsset.asset.date)
                .from(QAsset.asset)
                .where(QAsset.asset.club.id.eq(clubId),
                        QAsset.asset.lcName.eq(lcName),
                        QAsset.asset.ascName.eq(ascName),
                        QAsset.asset.date.gt(date))
                .orderBy(QAsset.asset.date.asc())
                .fetchFirst();

        if (yearMonth == null) {
            yearMonth = YearMonth.now();
        } else {
            yearMonth = yearMonth.minusMonths(1);
        }

        List<YearMonth> result = queryFactory.select(QAsset.asset.date).distinct()
                .from(QAsset.asset)
                .where(QAsset.asset.club.id.eq(clubId),
                        QAsset.asset.date.between(date.plusMonths(1), yearMonth))
                .fetch();

        return result;
    }

    @Override
    public void updateBalanceByClubIdAndLcNameAndAscNameAndDate(Long clubId, String lcName, String ascName, YearMonth date, int changes) {
        queryFactory.update(QAsset.asset)
                .set(QAsset.asset.balance, QAsset.asset.balance.add(changes))
                .where(QAsset.asset.club.id.eq(clubId),
                        QAsset.asset.lcName.eq(lcName),
                        QAsset.asset.ascName.eq(ascName),
                        QAsset.asset.date.goe(date))
                .execute();
    }

    @Override
    public Boolean findExistByClubIdAndDate(Long clubId, YearMonth date) {
        return queryFactory.selectFrom(QAsset.asset)
                .where(QAsset.asset.club.id.eq(clubId),
                        QAsset.asset.date.eq(date))
                .fetchFirst() != null;
    }

    @Override
    public List<Asset> findLatestAssetsByClubIdAndDate(Long clubId, YearMonth date) {
        YearMonth yearMonth = queryFactory.select(QAsset.asset.date)
                .from(QAsset.asset)
                .where(QAsset.asset.club.id.eq(clubId),
                        QAsset.asset.date.lt(date))
                .orderBy(QAsset.asset.date.desc())
                .fetchFirst();

        if (yearMonth == null) {
            return null;
        }

        List<Asset> result = queryFactory
                .select(QAsset.asset)
                .from(QAsset.asset)
                .where(QAsset.asset.club.id.eq(clubId),
                        QAsset.asset.date.eq(yearMonth))
                .fetch();

        return result;
    }

    @Override
    public Boolean findExistByClubIdAndLcNameAndAscNameAndDate(Long clubId, String lcName, String ascName, YearMonth date) {
        return queryFactory.selectFrom(QAsset.asset)
                .where(QAsset.asset.club.id.eq(clubId),
                        QAsset.asset.lcName.eq(lcName),
                        QAsset.asset.ascName.eq(ascName),
                        QAsset.asset.date.eq(date))
                .fetchFirst() != null;
    }

    @Override
    public List<Asset> findAssetWithBalanceByClubIdAndDate(Long clubId, YearMonth date) {
        List<Asset> result = queryFactory
                .select(QAsset.asset)
                .from(QAsset.asset)
                .where(QAsset.asset.club.id.eq(clubId),
                        QAsset.asset.date.eq(date),
                        QAsset.asset.balance.ne(0))
                .fetch();

        return result;
    }
}
