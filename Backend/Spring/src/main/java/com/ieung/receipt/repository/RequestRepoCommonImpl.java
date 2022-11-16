package com.ieung.receipt.repository;

import com.ieung.receipt.code.StateCode;
import com.ieung.receipt.entity.QClubCrew;
import com.ieung.receipt.entity.QRequest;
import com.ieung.receipt.entity.Request;
import com.ieung.receipt.util.QueryDslUtil;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class RequestRepoCommonImpl implements RequestRepoCommon {
    private final JPAQueryFactory queryFactory;
    private EntityManager em;

    public RequestRepoCommonImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
        this.em = em;
    }

    @Override
    public Page<Request> findByClubId(Long clubId, Pageable pageable) {
        List<OrderSpecifier> orders = getAllOrderSpecifiers(pageable);

        List<Request> result = queryFactory
                .selectFrom(QRequest.request)
                .where(QRequest.request.club.id.eq(clubId))
                .orderBy(orders.stream().toArray(OrderSpecifier[]::new))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = queryFactory
                .selectFrom(QRequest.request)
                .where(QRequest.request.club.id.eq(clubId))
                .fetch().size();

        return new PageImpl<>(result, pageable, total);
    }

    @Override
    public Page<Request> findByClubIdAndCrewId(Long clubId, Long crewId, Pageable pageable) {
        List<OrderSpecifier> orders = getAllOrderSpecifiers(pageable);

        List<Request> result = queryFactory
                .selectFrom(QRequest.request)
                .where(QRequest.request.club.id.eq(clubId),
                        QRequest.request.crewId.eq(crewId))
                .orderBy(orders.stream().toArray(OrderSpecifier[]::new))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = queryFactory
                .selectFrom(QRequest.request)
                .where(QRequest.request.club.id.eq(clubId),
                        QRequest.request.crewId.eq(crewId))
                .fetch().size();

        return new PageImpl<>(result, pageable, total);
    }

    @Override
    public Page<Request> findByClubIdAndState(Long clubId, StateCode state, Pageable pageable) {
        List<OrderSpecifier> orders = getAllOrderSpecifiers(pageable);

        List<Request> result = queryFactory
                .selectFrom(QRequest.request)
                .where(QRequest.request.club.id.eq(clubId),
                        QRequest.request.state.eq(state))
                .orderBy(orders.stream().toArray(OrderSpecifier[]::new))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = queryFactory
                .selectFrom(QRequest.request)
                .where(QRequest.request.club.id.eq(clubId),
                        QRequest.request.state.eq(state))
                .fetch().size();

        return new PageImpl<>(result, pageable, total);
    }

    @Override
    public Page<Request> findByClubIdAndCrewIdAndState(Long clubId, Long crewId, StateCode state, Pageable pageable) {
        List<OrderSpecifier> orders = getAllOrderSpecifiers(pageable);

        List<Request> result = queryFactory
                .selectFrom(QRequest.request)
                .where(QRequest.request.club.id.eq(clubId),
                        QRequest.request.crewId.eq(crewId),
                        QRequest.request.state.eq(state))
                .orderBy(orders.stream().toArray(OrderSpecifier[]::new))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = queryFactory
                .selectFrom(QRequest.request)
                .where(QRequest.request.club.id.eq(clubId),
                        QRequest.request.crewId.eq(crewId),
                        QRequest.request.state.eq(state))
                .fetch().size();

        return new PageImpl<>(result, pageable, total);
    }

    @Override
    public Optional<String> findReceiptUrlById(Long requestId) {
        Optional<String> result = Optional.ofNullable(queryFactory
                .select(QRequest.request.receiptUrl)
                .from(QRequest.request)
                .where(QRequest.request.id.eq(requestId))
                .fetchOne());
        return result;
    }

    // Pageable 객체의 sort를 list로 변환
    private List<OrderSpecifier> getAllOrderSpecifiers(Pageable pageable) {

        List<OrderSpecifier> ORDERS = new ArrayList<>();

        if (!pageable.getSort().isEmpty()) {
            for (Sort.Order order : pageable.getSort()) {
                Order direction = order.getDirection().isAscending() ? Order.ASC : Order.DESC;
                switch (order.getProperty()) {
                    case "id":
                        OrderSpecifier<?> orderId = QueryDslUtil.getSortedColumn(direction, QRequest.request, "id");
                        ORDERS.add(orderId);
                        break;
                    case "pay_date":
                        OrderSpecifier<?> orderName = QueryDslUtil.getSortedColumn(direction, QRequest.request, "payDate");
                        ORDERS.add(orderName);
                        break;
                    case "create_date":
                        OrderSpecifier<?> orderCreateDate = QueryDslUtil.getSortedColumn(direction, QRequest.request, "createDate");
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
