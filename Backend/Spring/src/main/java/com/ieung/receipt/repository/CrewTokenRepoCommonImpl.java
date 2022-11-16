package com.ieung.receipt.repository;

import com.ieung.receipt.code.AuthCode;
import com.ieung.receipt.entity.CrewToken;
import com.ieung.receipt.entity.QClubCrew;
import com.ieung.receipt.entity.QCrewToken;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

public class CrewTokenRepoCommonImpl implements CrewTokenRepoCommon {
    private final JPAQueryFactory queryFactory;
    private EntityManager em;

    public CrewTokenRepoCommonImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
        this.em = em;
    }

    @Override
    public CrewToken findByFcmToken(String fcmToken) {
        CrewToken result = queryFactory
                .select(QCrewToken.crewToken)
                .from(QCrewToken.crewToken)
                .where(QCrewToken.crewToken.fcmToken.eq(fcmToken),
                        QCrewToken.crewToken.refreshToken.isNotNull())
                .fetchOne();

        return result;
    }

    @Override
    public CrewToken findByCrewIdAndFcmToken(long crewId, String fcmToken) {
        CrewToken result = queryFactory
                .select(QCrewToken.crewToken)
                .from(QCrewToken.crewToken)
                .where(QCrewToken.crewToken.fcmToken.eq(fcmToken),
                        QCrewToken.crewToken.crew.id.eq(crewId))
                .fetchOne();

        return result;
    }

    @Override
    public Optional<CrewToken> findByCrewIdAndRefreshToken(Long crewId, String refreshToken) {
        Optional<CrewToken> result = Optional.ofNullable(queryFactory
                .select(QCrewToken.crewToken)
                .from(QCrewToken.crewToken)
                .where(QCrewToken.crewToken.refreshToken.eq(refreshToken),
                        QCrewToken.crewToken.crew.id.eq(crewId))
                .fetchOne());

        return result;
    }

    @Override
    public List<CrewToken> findByCrewId(Long crewId) {
        List<CrewToken> result = queryFactory
                .select(QCrewToken.crewToken)
                .from(QCrewToken.crewToken)
                .where(QCrewToken.crewToken.crew.id.eq(crewId))
                .fetch();

        return result;
    }

    @Override
    public List<CrewToken> findLeaderByClubId(Long clubId) {
        List<CrewToken> result = queryFactory
                .select(QCrewToken.crewToken)
                .from(QCrewToken.crewToken)
                .where(QCrewToken.crewToken.crew.id.in(
                        JPAExpressions
                                .select(QClubCrew.clubCrew.crew.id)
                                .from(QClubCrew.clubCrew)
                                .where(QClubCrew.clubCrew.club.id.eq(clubId),
                                        QClubCrew.clubCrew.auth.eq(AuthCode.LEADER))
                ))
                .fetch();

        return result;
    }

    @Override
    public List<CrewToken> findLeaderOrManagerByClubId(Long clubId) {
        List<CrewToken> result = queryFactory
                .select(QCrewToken.crewToken)
                .from(QCrewToken.crewToken)
                .where(QCrewToken.crewToken.crew.id.in(
                        JPAExpressions
                                .select(QClubCrew.clubCrew.crew.id)
                                .from(QClubCrew.clubCrew)
                                .where(QClubCrew.clubCrew.club.id.eq(clubId),
                                        QClubCrew.clubCrew.auth.eq(AuthCode.LEADER).or(QClubCrew.clubCrew.auth.eq(AuthCode.MANAGER)))
                ))
                .fetch();

        return result;
    }
}