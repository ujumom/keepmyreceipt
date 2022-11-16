package com.ieung.receipt.repository;

import com.ieung.receipt.entity.Notification;
import com.ieung.receipt.entity.QClubCrew;
import com.ieung.receipt.entity.QNotification;
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

public class NotificationRepoCommonImpl implements NotificationRepoCommon {
    private final JPAQueryFactory queryFactory;
    private EntityManager em;

    public NotificationRepoCommonImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
        this.em = em;
    }

    @Override
    public Page<Notification> findByCrewId(long crewId, Pageable pageable) {
        List<OrderSpecifier> orders = getAllOrderSpecifiers(pageable);

        List<Notification> result = queryFactory
                .selectFrom(QNotification.notification)
                .where(QNotification.notification.crew.id.eq(crewId))
                .orderBy(orders.stream().toArray(OrderSpecifier[]::new))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = queryFactory
                .selectFrom(QNotification.notification)
                .where(QNotification.notification.crew.id.eq(crewId))
                .fetch().size();

        return new PageImpl<>(result, pageable, total);
    }

    // Pageable 객체의 sort를 list로 변환
    private List<OrderSpecifier> getAllOrderSpecifiers(Pageable pageable) {

        List<OrderSpecifier> ORDERS = new ArrayList<>();

        if (!pageable.getSort().isEmpty()) {
            for (Sort.Order order : pageable.getSort()) {
                Order direction = order.getDirection().isAscending() ? Order.ASC : Order.DESC;
                switch (order.getProperty()) {
                    case "id":
                        OrderSpecifier<?> orderId = QueryDslUtil.getSortedColumn(direction, QNotification.notification, "id");
                        ORDERS.add(orderId);
                        break;
                    case "create_date":
                        OrderSpecifier<?> orderName = QueryDslUtil.getSortedColumn(direction, QNotification.notification, "createDate");
                        ORDERS.add(orderName);
                        break;
                    default:
                        break;
                }
            }
        }

        return ORDERS;
    }
}
