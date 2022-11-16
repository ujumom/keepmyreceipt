package com.ieung.receipt.controller;

import com.ieung.receipt.code.NotiCode;
import com.ieung.receipt.dto.req.TransactionReqDTO;
import com.ieung.receipt.dto.res.*;
import com.ieung.receipt.entity.*;
import com.ieung.receipt.service.CrewTokenService;
import com.ieung.receipt.service.NotificationService;
import com.ieung.receipt.service.RequestService;
import com.ieung.receipt.service.TransactionService;
import com.ieung.receipt.service.common.CommonResult;
import com.ieung.receipt.service.common.ResponseService;
import com.ieung.receipt.service.common.SingleResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.ieung.receipt.util.TokenUtil.getCurrentCrewId;

@Tag(name = "09. 거래내역")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/spring/club")
public class TransactionController {
    private final TransactionService transactionService;
    private final ResponseService responseService;
    private final CrewTokenService crewTokenService;
    private final NotificationService notificationService;
    private final RequestService requestService;

    /**
     * 거래내역 등록 : post /{clubId}/transaction
     * 거래내역 조회 : get /transaction/{transactionId}
     * 거래내역 검색 : get /{clubId}/transactions?query={query}&start={start}&end={end}&page=0&size=10&sort=id,ASC
     * 거래내역 삭제 : delete /transaction/{transactionId}
     * 거래내역 수정 : put /transaction/{transactionId}
     */

    // 거래내역 등록
    @Operation(summary = "거래내역 등록", description = "거래내역 등록")
    @PostMapping(value = "/{clubId}/transaction", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult createTransaction(@PathVariable @NotNull Long clubId, @Valid @RequestBody TransactionReqDTO transactionReqDTO) throws Exception {
        Transaction transaction = transactionService.createTransaction(clubId, getCurrentCrewId(), transactionReqDTO);

        // 영수증 청구한 회원에게 알림 전송
        if (transaction.getRequest() != null) {
            Request request = transaction.getRequest();
            List<CrewToken> crewTokens = crewTokenService.getNormalCrewToken(request.getCrewId());
            notificationService.createManyNotifications(NotiCode.CHARGE,request.getId(), "청구 승인 알림",
                    request.getPrice() + "원이 승인되었습니다.",
                    request.getClub(), crewTokens);
        }

        return responseService.getSuccessResult();
    }

    // 거래내역 조회
    @Operation(summary = "거래내역 조회", description = "거래내역 조회")
    @GetMapping(value = "/transaction/{transactionId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody SingleResult<TransactionResDTO> getTransaction(@PathVariable @NotNull Long transactionId) throws Exception {
        Transaction transaction = transactionService.getTransaction(getCurrentCrewId(), transactionId);

        // 반환 DTO에 맞도록 가공
        List<TransactionDetailResDTO> list = IntStream.range(0, transaction.getTransactionDetails().size())
                .mapToObj(i -> transaction.getTransactionDetails().get(i).toTransactionDetailResDTO())
                .collect(Collectors.toList());

        TransactionResDTO transactionResDTO = TransactionResDTO.builder()
                .transactionId(transaction.getId())
                .date(transaction.getPayDate())
                .totalPrice(transaction.getPrice())
                .requestId(transaction.getRequest() != null ? transaction.getRequest().getId() : null)
                .receiptUrl(transaction.getRequest() != null ? requestService.getReceiptUrl(transaction.getRequest().getId()) : null)
                .items(list)
                .build();

        return responseService.getSingleResult(transactionResDTO);
    }

    // 거래내역 검색
    @Operation(summary = "거래내역 검색", description = "거래내역 검색")
    @GetMapping(value = "/{clubId}/transactions", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody SingleResult<BookResDTO> searchTransaction(@PathVariable @NotNull Long clubId,
                                                                                    @RequestParam(value = "query", defaultValue = "") String query,
                                                                                    @RequestParam(value = "start", defaultValue = "#{T(java.time.YearMonth).now().atDay(1)}") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate start,
                                                                                    @RequestParam(value = "end", defaultValue = "#{T(java.time.LocalDate).now()}") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate end,
                                                                                    @ParameterObject @PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) throws Exception {
        Page<TransactionDetail> page = transactionService.getTransactions(clubId, getCurrentCrewId(), query, start, end, pageable);

        // 반환 DTO에 맞도록 가공
        List<TransactionDetailSimpleResDTO> list = IntStream.range(0, page.getContent().size())
                .mapToObj(i -> page.getContent().get(i).toTransactionDetailSimpleResDTO())
                .collect(Collectors.toList());

        PagingListResDTO pagingListResDTO = new PagingListResDTO(page,list);

        BookResDTO book = BookResDTO.builder()
                .income(transactionService.getIncome(clubId, query, start, end))
                .expenditure(Math.abs(transactionService.getExpenditure(clubId, query, start, end)))
                .result(pagingListResDTO)
                .build();

        return responseService.getSingleResult(book);
    }

    // 거래내역 삭제
    @Operation(summary = "거래내역 삭제", description = "거래내역 삭제")
    @DeleteMapping(value = "/transaction/{transactionId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult deleteTransaction(@PathVariable @NotNull Long transactionId) throws Exception {
        Transaction transaction = transactionService.deleteTransaction(getCurrentCrewId(), transactionId);

        // 영수증 청구한 회원에게 알림 전송
        if (transaction.getRequest() != null) {
            Request request = transaction.getRequest();
            List<CrewToken> crewTokens = crewTokenService.getNormalCrewToken(request.getCrewId());
            notificationService.createManyNotifications(NotiCode.CHARGE,request.getId(), "청구 승인 취소 알림",
                    request.getPrice() + "원 승인이 취소되었습니다.",
                    request.getClub(), crewTokens);
        }

        return responseService.getSuccessResult();
    }

    // 거래내역 수정
    @Operation(summary = "거래내역 수정", description = "거래내역 수정")
    @PutMapping(value = "/transaction/{transactionId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult updateTransaction(@PathVariable @NotNull Long transactionId, @Valid @RequestBody TransactionReqDTO transactionReqDTO) throws Exception {
        transactionService.updateTransaction(getCurrentCrewId(), transactionId, transactionReqDTO);

        return responseService.getSuccessResult();
    }
}
