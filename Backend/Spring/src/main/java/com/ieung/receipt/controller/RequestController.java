package com.ieung.receipt.controller;

import com.ieung.receipt.code.NotiCode;
import com.ieung.receipt.code.StateCode;
import com.ieung.receipt.dto.req.RequestReqDTO;
import com.ieung.receipt.dto.res.PagingListResDTO;
import com.ieung.receipt.dto.res.RequestResDTO;
import com.ieung.receipt.dto.res.RequestSimpleResDTO;
import com.ieung.receipt.entity.CrewToken;
import com.ieung.receipt.entity.Request;
import com.ieung.receipt.exception.ApiMessageException;
import com.ieung.receipt.service.CrewTokenService;
import com.ieung.receipt.service.NotificationService;
import com.ieung.receipt.service.RequestService;
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
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.ieung.receipt.util.TokenUtil.getCurrentCrewId;

@Tag(name = "06. 청구 요청")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/spring")
public class RequestController {
    private final RequestService requestService;
    private final ResponseService responseService;
    private final CrewTokenService crewTokenService;
    private final NotificationService notificationService;

    /**
     * 청구 요청 등록 : post /club/{clubId}/request
     * 청구 목록 조회 :  get /club/{clubId}/requests?state={state}&page=0&size=10&sort=id,ASC
     * 특정 청구 내역 조회 : get /club/request/{requestId}
     * 특정 청구 내역 수정 : put /club/request/{requestId}
     * 특정 청구 내역 삭제 : delete /club/request/{requestId}
     * 특정 청구 내역 거절 : put /club/request/{requestId}/refusal
     */

    // 청구 요청 등록
    @Operation(summary = "청구 요청 등록", description = "청구 요청 등록")
    @PostMapping(value = "/club/{clubId}/request", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult createRequest(@PathVariable @NotBlank long clubId, @Valid @RequestBody RequestReqDTO requestReqDTO) {
        Request request = requestService.createRequest(clubId, getCurrentCrewId(), requestReqDTO);

        // 알림 전송
        List<CrewToken> crewTokens = crewTokenService.getLeaderOrManagerCrewTokenList(clubId);
        notificationService.createManyNotifications(NotiCode.CHARGE,request.getId(), "청구 알림",
                request.getCrewName() + "님이 "+ request.getPrice() + "원을 청구하였습니다.",
                request.getClub(), crewTokens);

        return responseService.getSuccessResult();
    }

    // 청구 목록 조회
    @Operation(summary = "청구 목록 조회", description = "청구 목록 조회")
    @GetMapping(value = "/club/{clubId}/requests", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody SingleResult<PagingListResDTO<RequestSimpleResDTO>> getRequests(@PathVariable @NotBlank long clubId,
                                                                    @RequestParam(value="state", defaultValue = "ALL") String state,
                                                                    @ParameterObject @PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        try {
            // String state값 stateCode로 변환
            StateCode stateCode = StateCode.valueOf(state);
            Page<Request> page = requestService.getRequests(clubId, getCurrentCrewId(), stateCode, pageable);

            // 반환 DTO에 맞도록 가공
            List<RequestSimpleResDTO> clubCrews = IntStream.range(0, page.getContent().size())
                    .mapToObj(i -> page.getContent().get(i).toRequestSimpleResDTO())
                    .collect(Collectors.toList());

            PagingListResDTO pagingListResDTO = new PagingListResDTO(page, clubCrews);

            return responseService.getSingleResult(pagingListResDTO);

        } catch (IllegalArgumentException iae) {
            throw new ApiMessageException("지원하지 않는 상태입니다.");
        }
    }

    // 특정 청구 내역 조회
    @Operation(summary = "특정 청구 내역 조회", description = "특정 청구 내역 조회")
    @GetMapping(value = "/club/request/{requestId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody SingleResult<RequestResDTO> getRequest(@PathVariable @NotBlank long requestId) {
        Request request = requestService.getRequest(requestId, getCurrentCrewId());

        // 반환 DTO에 맞도록 가공
        RequestResDTO requestResDTO = request.toRequestResDTO();
        return responseService.getSingleResult(requestResDTO);
    }

    // 특정 청구 내역 수정
    @Operation(summary = "특정 청구 내역 수정", description = "특정 청구 내역 수정")
    @PutMapping(value = "/club/request/{requestId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult updateRequest(@PathVariable @NotBlank long requestId, @Valid @RequestBody RequestReqDTO requestReqDTO) {
        requestService.updateRequest(requestId, getCurrentCrewId(), requestReqDTO);

        return responseService.getSuccessResult();
    }

    // 특정 청구 내역 삭제
    @Operation(summary = "특정 청구 내역 삭제", description = "특정 청구 내역 삭제")
    @DeleteMapping(value = "/club/request/{requestId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult deleteRequest(@PathVariable @NotBlank long requestId) {
        requestService.deleteRequest(requestId, getCurrentCrewId());

        return responseService.getSuccessResult();
    }

    // 특정 청구 내역 거절
    @Operation(summary = "특정 청구 내역 거절", description = "특정 청구 내역 거절")
    @PutMapping(value = "/club/request/{requestId}/refusal", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult refusalRequest(@PathVariable @NotBlank long requestId) {
        Request request = requestService.refusalRequest(requestId, getCurrentCrewId());

        // 알림 전송
        List<CrewToken> crewTokens = crewTokenService.getNormalCrewToken(request.getCrewId());
        notificationService.createManyNotifications(NotiCode.CHARGE, requestId, "청구 거절 알림",
                request.getPrice() + "원 청구가 거절되었습니다.",
                request.getClub(), crewTokens);

        return responseService.getSuccessResult();
    }
}
