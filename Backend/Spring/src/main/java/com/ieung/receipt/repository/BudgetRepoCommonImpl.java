package com.ieung.receipt.repository;

import com.ieung.receipt.entity.Asset;
import com.ieung.receipt.entity.Budget;
import com.ieung.receipt.entity.QAsset;
import com.ieung.receipt.entity.QBudget;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.YearMonth;
import java.util.List;

@Repository
@Transactional
public class BudgetRepoCommonImpl implements BudgetRepoCommon {
    private final JPAQueryFactory queryFactory;
    private EntityManager em;

    public BudgetRepoCommonImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
        this.em = em;
    }

    @Override
    public void updateChangesInSameYearByClubIdAndLcNameAndBscNameAndDate(Long clubId, String lcName, String bscName, YearMonth date, int changes) {
        queryFactory.update(QBudget.budget)
                .set(QBudget.budget.changes, QBudget.budget.changes.add(changes))
                .where(QBudget.budget.club.id.eq(clubId),
                        QBudget.budget.lcName.eq(lcName),
                        QBudget.budget.bscName.eq(bscName),
                        QBudget.budget.date.between(date, YearMonth.of(date.getYear(), 12)))
                .execute();
    }

    @Override
    public void updateChangesByClubIdAndLcNameAndBscNameAndDate(Long clubId, String lcName, String bscName, YearMonth date, int changes) {
        queryFactory.update(QBudget.budget)
                .set(QBudget.budget.changes, QBudget.budget.changes.add(changes))
                .where(QBudget.budget.club.id.eq(clubId),
                        QBudget.budget.lcName.eq(lcName),
                        QBudget.budget.bscName.eq(bscName),
                        QBudget.budget.date.eq(date))
                .execute();
    }

    @Override
    public Boolean findExistByClubIdAndDate(Long clubId, YearMonth date) {
        return queryFactory.selectFrom(QBudget.budget)
                .where(QBudget.budget.club.id.eq(clubId),
                        QBudget.budget.date.eq(date))
                .fetchFirst() != null;
    }

    @Override
    public List<Budget> findPostingBudgetsByClubIdAndDate(Long clubId, YearMonth date) {
        YearMonth yearMonth = queryFactory.select(QBudget.budget.date)
                .from(QBudget.budget)
                .where(QBudget.budget.club.id.eq(clubId),
                        QBudget.budget.date.between(YearMonth.of(date.getYear(), 1), date.minusMonths(1)))
                .orderBy(QBudget.budget.date.desc())
                .fetchFirst();

        if (yearMonth == null) {
            return null;
        }

        List<Budget> result = queryFactory
                .selectFrom(QBudget.budget)
                .where(QBudget.budget.club.id.eq(clubId),
                        QBudget.budget.date.eq(yearMonth),
                        QBudget.budget.lcName.eq("전기예산"))
                .fetch();

        return result;
    }

    @Override
    public boolean findExistByClubIdAndLcNameAndBscNameAndDate(Long clubId, String lcName, String scName, YearMonth date) {
        return queryFactory.selectFrom(QBudget.budget)
                .where(QBudget.budget.club.id.eq(clubId),
                        QBudget.budget.lcName.eq(lcName),
                        QBudget.budget.bscName.eq(scName),
                        QBudget.budget.date.eq(date))
                .fetchFirst() != null;
    }

    @Override
    public List<YearMonth> findDateInSameYearByClubIdAndLcNameAndAscNameAndDate(Long clubId, String lcName, String scName, YearMonth date) {
        // 해당 소분류가 존재하지 않는 공백 계산
        YearMonth yearMonth = queryFactory.select(QBudget.budget.date)
                .from(QBudget.budget)
                .where(QBudget.budget.club.id.eq(clubId),
                        QBudget.budget.lcName.eq(lcName),
                        QBudget.budget.bscName.eq(scName),
                        QBudget.budget.date.between(date.plusMonths(1), YearMonth.of(date.getYear(), 12)))
                .orderBy(QBudget.budget.date.asc())
                .fetchFirst();

        if (yearMonth == null) {
            yearMonth = YearMonth.of(date.getYear(), 12);
        } else {
            yearMonth = yearMonth.minusMonths(1);
        }

        List<YearMonth> result = queryFactory.select(QBudget.budget.date).distinct()
                .from(QBudget.budget)
                .where(QBudget.budget.club.id.eq(clubId),
                        QBudget.budget.date.between(date.plusMonths(1), yearMonth))
                .fetch();

        return result;
    }

    @Override
    public List<Budget> findBudgetWithChangesByClubIdAndDate(Long clubId, YearMonth date) {
        List<Budget> result  = queryFactory
                .selectFrom(QBudget.budget)
                .where(QBudget.budget.club.id.eq(clubId),
                        QBudget.budget.date.eq(date),
                        QBudget.budget.changes.ne(0))
                .fetch();

        return result;
    }
}
