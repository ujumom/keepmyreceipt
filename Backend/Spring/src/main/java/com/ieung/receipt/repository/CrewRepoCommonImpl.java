package com.ieung.receipt.repository;

import com.ieung.receipt.entity.Crew;
import com.ieung.receipt.entity.QCrew;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

@Repository
@Transactional
public class CrewRepoCommonImpl implements CrewRepoCommon {
    private final JPAQueryFactory queryFactory;
    private EntityManager em;

    public CrewRepoCommonImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
        this.em = em;
    }

    @Override
    public Crew findByEmail(String email) {
        Crew result = queryFactory
                .select(QCrew.crew)
                .from(QCrew.crew)
                .where(QCrew.crew.email.eq(email))
                .fetchOne();

        return result;
    }
}