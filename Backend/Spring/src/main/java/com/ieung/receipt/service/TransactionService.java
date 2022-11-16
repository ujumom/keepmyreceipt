package com.ieung.receipt.service;

import com.ieung.receipt.code.AuthCode;
import com.ieung.receipt.code.StateCode;
import com.ieung.receipt.dto.req.TransactionDetailReqDTO;
import com.ieung.receipt.dto.req.TransactionReqDTO;
import com.ieung.receipt.entity.*;
import com.ieung.receipt.exception.ApiMessageException;
import com.ieung.receipt.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TransactionService {
    private final ClubCrewRepository clubCrewRepository;
    private final RequestRepository requestRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionDetailRepository transactionDetailRepository;
    private final AssetSCategoryRepository assetSCategoryRepository;
    private final BudgetSCategoryRepository budgetSCategoryRepository;
    private final AssetRepository assetRepository;
    private final BudgetRepository budgetRepository;
    private final TagRepository tagRepository;

    /**
     * 거래 내역 등록
     * @param clubId, crewId, transactionReqDTO
     * @return transaction
     */
    @Transactional(readOnly = false)
    public Transaction createTransaction(Long clubId, Long crewId, TransactionReqDTO transactionReqDTO) {
        ClubCrew clubCrew = clubCrewRepository.findByClubIdAndCrewIdWithCrew(clubId, crewId)
                .orElseThrow(() -> new ApiMessageException("모임에 가입된 회원이 아닙니다."));

        if (clubCrew.getAuth() == AuthCode.NONE || clubCrew.getAuth() == AuthCode.NORMAL) {
            throw new AccessDeniedException("");
        }

        Transaction transaction;

        // 연관 영수증 청구 내역이 없는 경우
        if (transactionReqDTO.getRequestId() == null) {
            transaction = createTransactionWithoutRequest(clubCrew, transactionReqDTO);
        // 연관 영수증 청구 내역이 있는 경우
        } else {
            transaction = createTransactionWithRequest(clubCrew, transactionReqDTO);
        }

        Transaction resTransaction = transactionRepository.save(transaction);

        Map<Category, Integer> assetMap = new HashMap<>(); // 자산별 변동 저장하는 map
        Map<Category, Integer> budgetMap = new HashMap<>(); // 예산, 지출, 수입별 변동 저장하는 map

        // 각 세부 항목별로 저장
        List<TransactionDetail> transactionDetailList = calcChanges(transactionReqDTO, transaction, assetMap, budgetMap);

        // 현재 연월 자산현황표가 존재하지 않는다면 새로 생성
        if (!assetRepository.findExistByClubIdAndDate(transaction.getClub().getId(),
                                                        YearMonth.of(transaction.getPayDate().getYear(), transaction.getPayDate().getMonth()))) {
            List<Asset> latestAssets = assetRepository.findLatestAssetsByClubIdAndDate(transaction.getClub().getId(),
                    YearMonth.of(transaction.getPayDate().getYear(), transaction.getPayDate().getMonth()));

            if (latestAssets != null) {
                List<Asset> newAssets = new ArrayList<>();
                for (Asset asset : latestAssets) {
                    Asset newAsset = asset.copyAsset(transaction.getPayDate());
                    newAssets.add(newAsset);
                }
                assetRepository.saveAllAndFlush(newAssets);
            }
        }

        // 현재 연월 예산운영표가 존재하지 않는다면 전기예산만 새로 생성
        if (!budgetRepository.findExistByClubIdAndDate(transaction.getClub().getId(),
                                                        YearMonth.of(transaction.getPayDate().getYear(), transaction.getPayDate().getMonth()))) {
            List<Budget> latestBudgets = budgetRepository.findPostingBudgetsByClubIdAndDate(transaction.getClub().getId(),
                    YearMonth.of(transaction.getPayDate().getYear(), transaction.getPayDate().getMonth()));

            if (latestBudgets != null) {
                List<Budget> newBudgets = new ArrayList<>();
                for (Budget budget : latestBudgets) {
                    Budget newBudget = budget.copyBudget(transaction.getPayDate());
                    newBudgets.add(newBudget);
                }
                budgetRepository.saveAllAndFlush(newBudgets);
            }
        }

        // 이후 자산 현황표 수정, 자산 수정
        updateAsset(assetMap, transaction, true);

        // 이후 예산 운영표 수정
        updateBudget(budgetMap, transaction, true);

        transactionDetailRepository.saveAll(transactionDetailList);

        return resTransaction;
    }

    /**
     * request가 존재하는 거래내역 생성
     */
    public Transaction createTransactionWithRequest(ClubCrew clubCrew, TransactionReqDTO transactionReqDTO) {
        Request request = requestRepository.findById(transactionReqDTO.getRequestId())
                .orElseThrow(() -> new ApiMessageException("해당하는 청구 내역이 없습니다."));

        if (request.getClub().getId() != clubCrew.getClub().getId()) {
            throw new ApiMessageException("해당하는 청구 내역이 없습니다.");
        } else if (request.getState() != StateCode.REQUEST) {
            throw new ApiMessageException("이미 처리된 영수증입니다.");
        }

        request.updateState(StateCode.APPROVE);
        requestRepository.save(request);

        return Transaction.builder()
                .payDate(request.getPayDate())
                .price(request.getPrice())
                .approveCrewId(clubCrew.getCrew().getId())
                .requestCrewId(request.getCrewId())
                .request(request)
                .club(clubCrew.getClub())
                .build();
    }

    /**
     * request가 존재하지않는 거래내역 생성
     */
    public Transaction createTransactionWithoutRequest(ClubCrew clubCrew, TransactionReqDTO transactionReqDTO) {
        return Transaction.builder()
                .payDate(transactionReqDTO.getDate())
                .price(transactionReqDTO.getTotalPrice())
                .approveCrewId(clubCrew.getCrew().getId())
                .requestCrewId(clubCrew.getCrew().getId())
                .request(null)
                .club(clubCrew.getClub())
                .build();
    }

    /**
     * 리더, 관리자인지 확인
     * @param clubId, crewId
     */
    public void checkAuthLeaderOrManager(long clubId, long crewId) {
        AuthCode authCode = clubCrewRepository.findAuthCodeByClubIdAndCrewId(clubId, crewId);

        if (authCode == null || authCode == AuthCode.NONE) {
            throw new ApiMessageException("모임에 가입된 회원이 아닙니다.");
        } else if (authCode == AuthCode.NORMAL) {
            throw new AccessDeniedException("");
        }
    }

    /**
     * 회원인지 확인
     * @param clubId, crewId
     */
    public void checkAuthMember(long clubId, long crewId) {
        AuthCode authCode = clubCrewRepository.findAuthCodeByClubIdAndCrewId(clubId, crewId);

        if (authCode == null || authCode == AuthCode.NONE) {
            throw new ApiMessageException("모임에 가입된 회원이 아닙니다.");
        }
    }

    /**
     * 거래내역 리스트 조회
     * @param clubId, crewId, query, start, end, pageable
     */
    public Page<TransactionDetail> getTransactions(Long clubId, Long crewId, String query, LocalDate start, LocalDate end, Pageable pageable) {
        checkAuthMember(clubId, crewId);

        return transactionDetailRepository.findByContentOrTag(clubId, query, start, end, pageable);
    }

    /**
     * 총 수입 조회
     * @param clubId,start, end
     */
    public Integer getIncome(Long clubId, String query, LocalDate start, LocalDate end) {
        return transactionDetailRepository.findIncomeByClubIdAndDateAndContentOrTag(clubId, query, start, end);
    }

    /**
     * 총 지출 조회
     * @param clubId, crewId, query, start, end, pageable
     */
    public Integer getExpenditure(Long clubId, String query, LocalDate start, LocalDate end) {
        return transactionDetailRepository.findExpenditureByClubIdAndDateAndContentOrTag(clubId, query, start, end);
    }

    /**
     * 특정 거래내역 조회
     * @param crewId, transactionId
     */
    public Transaction getTransaction(Long crewId, Long transactionId) {
        Transaction transaction = transactionRepository.findTransactionByIdWithTransactionDetails(transactionId)
                .orElseThrow(() -> new ApiMessageException("해당하는 거래내역이 없습니다."));

        checkAuthMember(transaction.getClub().getId(), crewId);

        return transaction;
    }

    /**
     * 특정 거래내역 삭제
     * @param crewId, transactionId
     */
    @Transactional(readOnly = false)
    public Transaction deleteTransaction(Long crewId, Long transactionId) {
        Transaction transaction = transactionRepository.findTransactionByIdWithTransactionDetails(transactionId)
                .orElseThrow(() -> new ApiMessageException("해당하는 거래내역이 없습니다."));

        // 관련 청구 내역 승인 취소
        if (transaction.getRequest() != null ) {
            Request request = transaction.getRequest();
            request.updateState(StateCode.REQUEST);
            requestRepository.save(request);
        }

        checkAuthLeaderOrManager(transaction.getClub().getId(), crewId);

        Map<Category, Integer> assetMap = new HashMap<>(); // 자산별 변동 저장하는 map
        Map<Category, Integer> budgetMap = new HashMap<>(); // 예산, 지출, 수입별 변동 저장하는 map

        // 각 세부 항목별로 수정 내용 확인
        calcChanges(transaction, assetMap, budgetMap);

        // 이후 자산 현황표 수정, 자산 수정
        updateAsset(assetMap, transaction, false);

        // 이후 예산 운영표 수정
        updateBudget(budgetMap, transaction, false);

        transactionDetailRepository.deleteAll(transaction.getTransactionDetails());
        transactionRepository.delete(transaction);

        return transaction;
    }

    /**
     * 자산현황표 수정
     */
    @Transactional(readOnly = false)
    public void updateAsset(Map<Category, Integer> assetMap, Transaction transaction, boolean isInsert) {
        for (Category category : assetMap.keySet()) {
            String type = category.type;
            String lcName = category.lcName;
            String scName = category.scName;

            int changes = assetMap.get(category);

            if (isInsert) {
                // 해당 소분류가 현재 자산현황표에 없으면 새로 만들기
                if (!assetRepository.findExistByClubIdAndLcNameAndAscNameAndDate(transaction.getClub().getId(), lcName, scName,
                        YearMonth.of(transaction.getPayDate().getYear(), transaction.getPayDate().getMonth()))) {
                    List<YearMonth> yearMonths  = assetRepository.findDateByClubIdAndLcNameAndAscNameAndDate(transaction.getClub().getId(), lcName, scName,
                            YearMonth.of(transaction.getPayDate().getYear(), transaction.getPayDate().getMonth()));

                    yearMonths.add(YearMonth.of(transaction.getPayDate().getYear(), transaction.getPayDate().getMonth()));
                    List<Asset> assets = new ArrayList<>();

                    for (YearMonth yearMonth : yearMonths) {
                        Asset asset = Asset.builder()
                                .club(transaction.getClub())
                                .date(yearMonth)
                                .type(type)
                                .lcName(lcName)
                                .ascName(scName)
                                .balance(0)
                                .build();
                        assets.add(asset);
                    }

                    assetRepository.saveAllAndFlush(assets);
                }
            }

            // 이후 내역 update
            assetRepository.updateBalanceByClubIdAndLcNameAndAscNameAndDate(transaction.getClub().getId(), lcName, scName,
                    YearMonth.of(transaction.getPayDate().getYear(), transaction.getPayDate().getMonth()), changes);
            assetSCategoryRepository.updateBalanceByClubIdAndLcNameAndAscName(transaction.getClub().getId(), lcName, scName, changes);
        }
    }

    /**
     * 예산 운영표 수정
     */
    @Transactional(readOnly = false)
    public void updateBudget(Map<Category, Integer> budgetMap, Transaction transaction, boolean isInsert) {
        for (Category category : budgetMap.keySet()) {
            String type = category.type;
            String lcName = category.lcName;
            String scName = category.scName;

            int changes = budgetMap.get(category);

            if (isInsert) {
                // 해당 소분류가 현재 예산운영표에 없으면 새로 만들기
                if (!budgetRepository.findExistByClubIdAndLcNameAndBscNameAndDate(transaction.getClub().getId(), lcName, scName,
                        YearMonth.of(transaction.getPayDate().getYear(), transaction.getPayDate().getMonth()))) {

                    // 대분류가 전기예산이면 연별 누적
                    if (lcName.equals("전기예산")) {
                        List<YearMonth> yearMonths  = budgetRepository.findDateInSameYearByClubIdAndLcNameAndAscNameAndDate(transaction.getClub().getId(), lcName, scName,
                                YearMonth.of(transaction.getPayDate().getYear(), transaction.getPayDate().getMonth()));

                        List<Budget> budgets = new ArrayList<>();

                        yearMonths.add(YearMonth.of(transaction.getPayDate().getYear(), transaction.getPayDate().getMonth()));

                        for (YearMonth yearMonth : yearMonths) {
                            Budget budget = Budget.builder()
                                    .club(transaction.getClub())
                                    .date(yearMonth)
                                    .type(type)
                                    .lcName(lcName)
                                    .bscName(scName)
                                    .changes(0)
                                    .build();
                            budgets.add(budget);
                        }

                        budgetRepository.saveAllAndFlush(budgets);
                    } else {
                        Budget budget = Budget.builder()
                                .club(transaction.getClub())
                                .date(YearMonth.of(transaction.getPayDate().getYear(), transaction.getPayDate().getMonth()))
                                .type(type)
                                .lcName(lcName)
                                .bscName(scName)
                                .changes(0)
                                .build();

                        budgetRepository.save(budget);
                    }
                }
            }

            // 대분류가 전기예산이면 연별 누적
            if (lcName.equals("전기예산")) {
                budgetRepository.updateChangesInSameYearByClubIdAndLcNameAndBscNameAndDate(transaction.getClub().getId(), lcName, scName,
                        YearMonth.of(transaction.getPayDate().getYear(), transaction.getPayDate().getMonth()), changes);
            } else {
                budgetRepository.updateChangesByClubIdAndLcNameAndBscNameAndDate(transaction.getClub().getId(), lcName, scName,
                        YearMonth.of(transaction.getPayDate().getYear(), transaction.getPayDate().getMonth()), changes);
            }
        }
    }

    /**
     * 특정 거래내역 수정
     * @param crewId, transactionId
     */
    @Transactional(readOnly = false)
    public void updateTransaction(Long crewId, Long transactionId, TransactionReqDTO transactionReqDTO) {
        Transaction transaction = transactionRepository.findTransactionByIdWithTransactionDetails(transactionId)
                .orElseThrow(() -> new ApiMessageException("해당하는 거래내역이 없습니다."));

        checkAuthLeaderOrManager(transaction.getClub().getId(), crewId);

        if (transaction.getRequest() == null) {
            transaction.updatePrice(transactionReqDTO.getTotalPrice());
            transaction.updatePayDate(transactionReqDTO.getDate());
        } else {
            if (transaction.getRequest().getId() != transactionReqDTO.getRequestId()) {
                throw new ApiMessageException("청구 번호는 변경할 수 없습니다.");
            } else if (transaction.getPayDate() != transactionReqDTO.getDate()) {
                throw new ApiMessageException("영수증 날짜와 동일해야합니다.");
            } else if (transaction.getPrice() != transactionReqDTO.getTotalPrice()) {
                throw new ApiMessageException("영수증 금액와 동일해야합니다.");
            }
        }

        Map<Category, Integer> assetMap = new HashMap<>(); // 자산별 변동 저장하는 map
        Map<Category, Integer> budgetMap = new HashMap<>(); // 예산, 지출, 수입별 변동 저장하는 map

        // 기존 세부 항목 삭제
        calcChanges(transaction, assetMap, budgetMap);
        transactionDetailRepository.deleteAll(transaction.getTransactionDetails());

        // 새로운 세부 항목 저장
        List<TransactionDetail> transactionDetailList = calcChanges(transactionReqDTO, transaction, assetMap, budgetMap);

        // 이후 자산 현황표 수정, 자산 수정
        updateAsset(assetMap, transaction, false);

        // 이후 예산 운영표 수정
        updateBudget(budgetMap, transaction, false);

        transactionDetailRepository.saveAll(transactionDetailList);
        transactionRepository.save(transaction);
    }

    /**
     * 거래내역 세부 항목 입력시 변동 계산
     */
    public List<TransactionDetail> calcChanges(TransactionReqDTO transactionReqDTO, Transaction transaction,  Map<Category, Integer> assetMap, Map<Category, Integer> budgetMap) {
        List<TransactionDetail> transactionDetailList = new ArrayList<>();
        int totalPrice = 0; // 총금액

        // 각 세부 항목별로 저장
        for (TransactionDetailReqDTO detailReqDTO : transactionReqDTO.getList()) {
            TransactionDetail transactionDetail = TransactionDetail.builder()
                    .transaction(transaction)
                    .payDate(transaction.getPayDate())
                    .type(detailReqDTO.getType())
                    .name(detailReqDTO.getName())
                    .largeTag(detailReqDTO.getLargeTag())
                    .smallTag(detailReqDTO.getSmallTag())
                    .price(detailReqDTO.getType().equals("자산") || detailReqDTO.getType().equals("지출") ?
                            0 - detailReqDTO.getPrice() : detailReqDTO.getPrice())
                    .memo(detailReqDTO.getMemo())
                    .build();

            if (detailReqDTO.getType().equals("자산")) {
                AssetSCategory assetSCategory = assetSCategoryRepository.findAssetSCategoryByClubAndLcNameAndAscName(transaction.getClub(), detailReqDTO.getLargeCategory(), detailReqDTO.getSmallCategory())
                        .orElseThrow(() -> new ApiMessageException("존재하는 소분류가 아닙니다."));

                transactionDetail.updateCategory(assetSCategory.getLcName(), assetSCategory.getAscName());

                Category category = new Category("자산", assetSCategory.getLcName(), assetSCategory.getAscName());
                assetMap.put(category, assetMap.getOrDefault(category, 0) + detailReqDTO.getPrice());

                // 소분류가 현금이 아닌 경우 현금 삭감
                if (!assetSCategory.getAscName().equals("현금")) {
                    category = new Category("자산", "현금 및 현금성자산", "현금");
                    assetMap.put(category, assetMap.getOrDefault(category, 0) + transactionDetail.getPrice());
                }
            } else {
                BudgetSCategory budgetSCategory = budgetSCategoryRepository.findBudgetSCategoryByClubAndLcNameAndBscName(transaction.getClub(), detailReqDTO.getLargeCategory(), detailReqDTO.getSmallCategory())
                        .orElseThrow(() -> new ApiMessageException("존재하는 소분류가 아닙니다."));
                transactionDetail.updateCategory(budgetSCategory.getLcName(), budgetSCategory.getBscName());

                Category category = new Category(transactionDetail.getType(), budgetSCategory.getLcName(), budgetSCategory.getBscName());
                budgetMap.put(category, budgetMap.getOrDefault(category, 0) + detailReqDTO.getPrice());

                // 현금 변동도 기록
                category = new Category("자산", "현금 및 현금성자산", "현금");
                assetMap.put(category, assetMap.getOrDefault(category, 0) + transactionDetail.getPrice());
            }

            totalPrice += detailReqDTO.getPrice();
            transactionDetailList.add(transactionDetail);
        }

        // 총액 일치 여부 확인
        if (totalPrice != transaction.getPrice()) {
            throw new ApiMessageException("항목 금액의 총계가 총금액과 일치하지 않습니다.");
        }

        return transactionDetailList;
    }

    /**
     * 거래내역 세부 항목 삭제시 변동 계산
     */
    public void calcChanges(Transaction transaction, Map<Category, Integer> assetMap, Map<Category, Integer> budgetMap) {
        // 각 세부 항목별로 수정 내용 확인
        for (TransactionDetail transactionDetail : transaction.getTransactionDetails()) {
            if (transactionDetail.getType().equals("자산")) {
                AssetSCategory assetSCategory = assetSCategoryRepository
                        .findAssetSCategoryByClubAndLcNameAndAscName(transaction.getClub(), transactionDetail.getLargeCategory(), transactionDetail.getSmallCategory())
                        .orElseThrow(() -> new ApiMessageException("존재하는 소분류가 아닙니다."));

                Category category = new Category("자산", assetSCategory.getLcName(), assetSCategory.getAscName());
                assetMap.put(category, assetMap.getOrDefault(category, 0) + transactionDetail.getPrice());

                // 소분류가 현금이 아닌 경우 현금 추가
                if (!assetSCategory.getAscName().equals("현금")) {
                    category = new Category("자산", "현금 및 현금성자산", "현금");
                    assetMap.put(category, assetMap.getOrDefault(category, 0) + (0 - transactionDetail.getPrice()));
                }
            } else {
                BudgetSCategory budgetSCategory = budgetSCategoryRepository
                        .findBudgetSCategoryByClubAndLcNameAndBscName(transaction.getClub(), transactionDetail.getLargeCategory(), transactionDetail.getSmallCategory())
                        .orElseThrow(() -> new ApiMessageException("존재하는 소분류가 아닙니다."));

                Category category = new Category(transactionDetail.getType(), budgetSCategory.getLcName(), budgetSCategory.getBscName());

                if (transactionDetail.getType().equals("지출")) {
                    budgetMap.put(category, budgetMap.getOrDefault(category, 0) + transactionDetail.getPrice());
                } else {
                    budgetMap.put(category, budgetMap.getOrDefault(category, 0) + (0 - transactionDetail.getPrice()));
                }

                // 현금 변동
                category = new Category("자산", "현금 및 현금성자산", "현금");
                assetMap.put(category, assetMap.getOrDefault(category, 0) + (0 - transactionDetail.getPrice()));
            }
        }
    }

    class Category {
        String type;
        String lcName;
        String scName;

        Category(String type, String lcName, String scName) {
            this.type = type;
            this.lcName = lcName;
            this.scName = scName;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Category category = (Category) o;
            return Objects.equals(type, category.type) && Objects.equals(lcName, category.lcName) && Objects.equals(scName, category.scName);
        }

        @Override
        public int hashCode() {
            return Objects.hash(type, lcName, scName);
        }
    }
}
