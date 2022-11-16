package com.ieung.receipt.repository;

import com.ieung.receipt.entity.QTransaction;
import com.ieung.receipt.entity.QTransactionDetail;
import com.ieung.receipt.entity.Transaction;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.Optional;

@Repository
@Transactional
public class TransactionRepoCommonImpl implements TransactionRepoCommon {
    private final JPAQueryFactory queryFactory;
    private EntityManager em;

    public TransactionRepoCommonImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
        this.em = em;
    }

    @Override
    public Optional<Transaction> findTransactionByIdWithTransactionDetails(Long id) {
        Optional<Transaction> result = Optional.ofNullable(queryFactory
                .selectFrom(QTransaction.transaction)
                .innerJoin(QTransaction.transaction.transactionDetails)
                .fetchJoin()
                .where(QTransaction.transaction.id.eq(id))
                .fetchOne());

        return result;
    }
}
