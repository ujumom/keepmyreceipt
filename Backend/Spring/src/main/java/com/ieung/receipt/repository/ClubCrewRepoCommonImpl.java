package com.ieung.receipt.repository;

import com.ieung.receipt.code.AuthCode;
import com.ieung.receipt.entity.ClubCrew;
import com.ieung.receipt.entity.QClub;
import com.ieung.receipt.entity.QClubCrew;
import com.ieung.receipt.entity.QCrew;
import com.ieung.receipt.util.QueryDslUtil;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public class ClubCrewRepoCommonImpl implements ClubCrewRepoCommon {
    private final JPAQueryFactory queryFactory;
    private EntityManager em;

    public ClubCrewRepoCommonImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
        this.em = em;
    }

    @Override
    public Optional<ClubCrew> findByClubIdAndCrewId(Long clubId, Long crewId) {
        Optional<ClubCrew> result = Optional.ofNullable(queryFactory
                .select(QClubCrew.clubCrew)
                .from(QClubCrew.clubCrew)
                .where(QClubCrew.clubCrew.crew.id.eq(crewId),
                        QClubCrew.clubCrew.club.id.eq(clubId))
                .fetchOne());

        return result;
    }

    @Override
    public Optional<ClubCrew> findByClubIdAndCrewIdWithCrew(Long clubId, Long crewId) {
        Optional<ClubCrew> result = Optional.ofNullable(queryFactory
                .select(QClubCrew.clubCrew)
                .from(QClubCrew.clubCrew)
                .innerJoin(QClubCrew.clubCrew.crew, QCrew.crew)
                .fetchJoin()
                .where(QClubCrew.clubCrew.crew.id.eq(crewId),
                        QClubCrew.clubCrew.club.id.eq(clubId))
                .fetchOne());

        return result;
    }

    @Override
    public Long findCountByClubId(Long clubId) {
        Long result = queryFactory
                .select(QClubCrew.clubCrew.count())
                .from(QClubCrew.clubCrew)
                .where(QClubCrew.clubCrew.club.id.eq(clubId),
                        QClubCrew.clubCrew.auth.ne(AuthCode.NONE))
                .fetchOne();

        return result;
    }

    @Override
    public AuthCode findAuthCodeByClubIdAndCrewId(long clubId, long crewId) {
        AuthCode result = queryFactory
                .select(QClubCrew.clubCrew.auth)
                .from(QClubCrew.clubCrew)
                .where(QClubCrew.clubCrew.crew.id.eq(crewId),
                        QClubCrew.clubCrew.club.id.eq(clubId))
                .fetchOne();

        return result;
    }

    @Override
    public Boolean findExistByClubIdAndCrewId(Long clubId, Long crewId) {
        return queryFactory
                .selectFrom(QClubCrew.clubCrew)
                .where(QClubCrew.clubCrew.crew.id.eq(crewId),
                        QClubCrew.clubCrew.club.id.eq(clubId))
                .fetchFirst() != null;
    }

    @Override
    public Page<ClubCrew> findAllByClubId(Long clubId, Pageable pageable) {
        List<OrderSpecifier> orders = getAllOrderSpecifiers(pageable);

        List<ClubCrew> result = queryFactory
                .select(QClubCrew.clubCrew)
                .from(QClubCrew.clubCrew)
                .innerJoin(QClubCrew.clubCrew.crew, QCrew.crew)
                .fetchJoin()
                .where(QClubCrew.clubCrew.club.id.eq(clubId),
                        QClubCrew.clubCrew.auth.ne(AuthCode.NONE))
                .orderBy(orders.stream().toArray(OrderSpecifier[]::new))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = queryFactory
                .select(QClubCrew.clubCrew)
                .from(QClubCrew.clubCrew)
                .innerJoin(QClubCrew.clubCrew.crew, QCrew.crew)
                .fetchJoin()
                .where(QClubCrew.clubCrew.club.id.eq(clubId),
                        QClubCrew.clubCrew.auth.ne(AuthCode.NONE))
                .fetch().size();

        return new PageImpl<>(result, pageable, total);
    }

    @Override
    public Page<ClubCrew> findByClubIdAndAuthCode(Long clubId, AuthCode authCode, Pageable pageable) {
        List<OrderSpecifier> orders = getAllOrderSpecifiers(pageable);

        List<ClubCrew> result = queryFactory
                .select(QClubCrew.clubCrew)
                .from(QClubCrew.clubCrew)
                .innerJoin(QClubCrew.clubCrew.crew, QCrew.crew)
                .fetchJoin()
                .where(QClubCrew.clubCrew.club.id.eq(clubId),
                        QClubCrew.clubCrew.auth.eq(authCode))
                .orderBy(orders.stream().toArray(OrderSpecifier[]::new))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = queryFactory
                .select(QClubCrew.clubCrew)
                .from(QClubCrew.clubCrew)
                .innerJoin(QClubCrew.clubCrew.crew, QCrew.crew)
                .fetchJoin()
                .where(QClubCrew.clubCrew.club.id.eq(clubId),
                        QClubCrew.clubCrew.auth.eq(authCode))
                .fetch().size();

        return new PageImpl<>(result, pageable, total);
    }

    @Override
    public Page<ClubCrew> findRequestsByClubId(Long clubId, Pageable pageable) {
        List<OrderSpecifier> orders = getAllOrderSpecifiers(pageable);

        List<ClubCrew> result = queryFactory
                .selectFrom(QClubCrew.clubCrew)
                .innerJoin(QClubCrew.clubCrew.crew, QCrew.crew)
                .fetchJoin()
                .where(QClubCrew.clubCrew.club.id.eq(clubId),
                        QClubCrew.clubCrew.auth.eq(AuthCode.NONE))
                .orderBy(orders.stream().toArray(OrderSpecifier[]::new))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = queryFactory
                .selectFrom(QClubCrew.clubCrew)
                .innerJoin(QClubCrew.clubCrew.crew, QCrew.crew)
                .fetchJoin()
                .where(QClubCrew.clubCrew.club.id.eq(clubId),
                        QClubCrew.clubCrew.auth.eq(AuthCode.NONE))
                .fetch().size();

        return new PageImpl<>(result, pageable, total);
    }

    @Override
    public Optional<ClubCrew> findByIdWithClub(Long clubCrewId) {
        Optional<ClubCrew> result = Optional.ofNullable(queryFactory
                .selectFrom(QClubCrew.clubCrew)
                .innerJoin(QClubCrew.clubCrew.club, QClub.club)
                .fetchJoin()
                .where(QClubCrew.clubCrew.id.eq(clubCrewId))
                .fetchOne());

        return result;
    }

    @Override
    public Boolean findExistLeaderByCrewId(long crewId) {
        return queryFactory
                .selectFrom(QClubCrew.clubCrew)
                .where(QClubCrew.clubCrew.crew.id.eq(crewId),
                        QClubCrew.clubCrew.auth.eq(AuthCode.LEADER))
                .fetchFirst() != null;
    }

    // Pageable 객체의 sort를 list로 변환
    private List<OrderSpecifier> getAllOrderSpecifiers(Pageable pageable) {

        List<OrderSpecifier> ORDERS = new ArrayList<>();

        if (!pageable.getSort().isEmpty()) {
            for (Sort.Order order : pageable.getSort()) {
                Order direction = order.getDirection().isAscending() ? Order.ASC : Order.DESC;
                switch (order.getProperty()) {
                    case "id":
                        OrderSpecifier<?> orderId = QueryDslUtil.getSortedColumn(direction, QClubCrew.clubCrew, "id");
                        ORDERS.add(orderId);
                        break;
                    case "auth":
                        List<String> list = new ArrayList<>();
                        list.addAll(Arrays.asList("리더", "관리자", "회원"));
                        OrderSpecifier<?> orderName;
                        if (direction == Order.ASC) {
                            orderName = Expressions.stringTemplate("FIELD({0}, {1})", QClubCrew.clubCrew.auth, list).asc();
                        } else {
                            orderName = Expressions.stringTemplate("FIELD({0}, {1})", QClubCrew.clubCrew.auth, list).desc();
                        }
                        ORDERS.add(orderName);
                        break;
                    case "create_date":
                        OrderSpecifier<?> orderCreateDate = QueryDslUtil.getSortedColumn(direction, QClubCrew.clubCrew, "createDate");
                        ORDERS.add(orderCreateDate);
                        break;
                    default:
                        break;
                }
            }
        }

        return ORDERS;
    }
}