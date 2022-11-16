package com.ieung.receipt.repository;

import com.ieung.receipt.entity.QClub;
import com.ieung.receipt.entity.QTransactionDetail;
import com.ieung.receipt.entity.TransactionDetail;
import com.ieung.receipt.util.QueryDslUtil;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Repository
@Transactional
public class TransactionDetailRepoCommonImpl implements TransactionDetailRepoCommon {
    private final JPAQueryFactory queryFactory;
    private EntityManager em;

    public TransactionDetailRepoCommonImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
        this.em = em;
    }

    @Override
    public Page<TransactionDetail> findByContentOrTag(Long clubId, String query, LocalDate start, LocalDate end, Pageable pageable) {
        List<OrderSpecifier> orders = getAllOrderSpecifiers(pageable);

        List<TransactionDetail> result = queryFactory
                .selectFrom(QTransactionDetail.transactionDetail)
                .where(QTransactionDetail.transactionDetail.transaction.club.id.eq(clubId),
                        QTransactionDetail.transactionDetail.name.contains(query)
                            .or(QTransactionDetail.transactionDetail.largeTag.contains(query))
                                .or(QTransactionDetail.transactionDetail.smallTag.contains(query)),
                        QTransactionDetail.transactionDetail.payDate.between(start, end))
                .orderBy(orders.stream().toArray(OrderSpecifier[]::new))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = queryFactory
                .selectFrom(QTransactionDetail.transactionDetail)
                .where(QTransactionDetail.transactionDetail.transaction.club.id.eq(clubId),
                        QTransactionDetail.transactionDetail.name.contains(query)
                            .or(QTransactionDetail.transactionDetail.largeTag.contains(query))
                                .or(QTransactionDetail.transactionDetail.smallTag.contains(query)),
                        QTransactionDetail.transactionDetail.payDate.between(start, end))

                .fetch().size();

        return new PageImpl<>(result, pageable, total);
    }

    @Override
    public List<TransactionDetail> findByPayDate(Long clubId, YearMonth yearMonth) {
        List<TransactionDetail> result = queryFactory
                .selectFrom(QTransactionDetail.transactionDetail)
                .where(QTransactionDetail.transactionDetail.transaction.club.id.eq(clubId),
                        QTransactionDetail.transactionDetail.payDate.between(
                        yearMonth.atDay(1),
                        yearMonth.atEndOfMonth()))
                .fetch();
        return result;
    }

    @Override
    public int findIncomeByClubIdAndDateAndContentOrTag(Long clubId, String query, LocalDate start, LocalDate end) {
        Integer result = queryFactory
                .select(QTransactionDetail.transactionDetail.price.sum())
                .from(QTransactionDetail.transactionDetail)
                .where(QTransactionDetail.transactionDetail.transaction.club.id.eq(clubId),
                        QTransactionDetail.transactionDetail.name.contains(query)
                                .or(QTransactionDetail.transactionDetail.largeTag.contains(query))
                                .or(QTransactionDetail.transactionDetail.smallTag.contains(query)),
                        QTransactionDetail.transactionDetail.price.gt(0),
                        QTransactionDetail.transactionDetail.payDate.between(start, end))
                .fetchOne();

        if (result == null) {
            result = 0;
        }

        return result;
    }

    @Override
    public int findExpenditureByClubIdAndDateAndContentOrTag(Long clubId, String query, LocalDate start, LocalDate end) {
        Integer result = queryFactory
                .select(QTransactionDetail.transactionDetail.price.sum())
                .from(QTransactionDetail.transactionDetail)
                .where(QTransactionDetail.transactionDetail.transaction.club.id.eq(clubId),
                        QTransactionDetail.transactionDetail.name.contains(query)
                                .or(QTransactionDetail.transactionDetail.largeTag.contains(query))
                                .or(QTransactionDetail.transactionDetail.smallTag.contains(query)),
                        QTransactionDetail.transactionDetail.price.lt(0),
                        QTransactionDetail.transactionDetail.payDate.between(start, end))
                .fetchOne();

        if (result == null) {
            result = 0;
        }

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
                        OrderSpecifier<?> orderId = QueryDslUtil.getSortedColumn(direction, QTransactionDetail.transactionDetail, "id");
                        ORDERS.add(orderId);
                        break;
                    case "pay_date":
                        OrderSpecifier<?> orderName = QueryDslUtil.getSortedColumn(direction, QTransactionDetail.transactionDetail, "payDate");
                        ORDERS.add(orderName);
                        break;
                    case "price":
                        OrderSpecifier<?> orderDescription = QueryDslUtil.getSortedColumn(direction, QTransactionDetail.transactionDetail, "price");
                        ORDERS.add(orderDescription);
                        break;
                    default:
                        break;
                }
            }
        }

        return ORDERS;
    }
}
