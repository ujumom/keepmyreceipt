package com.ieung.receipt.controller;

import com.ieung.receipt.code.AuthCode;
import com.ieung.receipt.code.NotiCode;
import com.ieung.receipt.dto.res.ClubCrewResDTO;
import com.ieung.receipt.dto.res.CrewReqsResDTO;
import com.ieung.receipt.dto.res.PagingListResDTO;
import com.ieung.receipt.entity.ClubCrew;
import com.ieung.receipt.entity.Crew;
import com.ieung.receipt.entity.CrewToken;
import com.ieung.receipt.exception.ApiMessageException;
import com.ieung.receipt.service.*;
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

import javax.validation.constraints.NotBlank;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.ieung.receipt.util.TokenUtil.getCurrentCrewId;

@Tag(name = "04. 모임 회원")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/spring/club")
public class ClubCrewController {
    private final CrewService crewService;
    private final ClubCrewService clubCrewService;
    private final CrewTokenService crewTokenService;
    private final ResponseService responseService;
    private final NotificationService notificationService;

    /**
     * 모임 가입 요청 : post /{clubId}/crew
     * 모임 가입 신청 리스트 조회 : get /{clubId}/crews/requests?page=0&size=10&sort=id,ASC
     * 모임 가입 승인 : put /crew/{clubCrewId}/request
     * 모임 가입 거절 : delete /crew/{clubCrewId}/request
     * 모임별 회원 리스트 조회 : get /{clubId}/crews?page=0&size=10&sort=id,ASC
     * 모임별 관리자 권한 지정 : put /crew/{clubCrewId}/auth/{auth}
     * 모임 강퇴 : delete /crew/{clubCrewId}/kick
     * 모임 탈퇴 : delete /{clubId}/crew
     * 특정 회원의 특정 모임 권한 조회 : get /{clubId}/crew/{crewId}/auth
     */

    // 모임 가입 신청
    @Operation(summary = "모임 가입 신청", description = "모임 가입 신청")
    @PostMapping(value = "/{clubId}/crew", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult joinClub(@PathVariable @NotBlank long clubId) throws Exception {
        Crew crew = crewService.findCrewById(getCurrentCrewId());
        ClubCrew clubCrew = clubCrewService.joinClub(clubId, crew);

        // 알림 전송
        List<CrewToken> crewTokens = crewTokenService.getLeaderCrewToken(clubId);
        notificationService.createOneNotification(NotiCode.JOIN, null, "가입 요청 알림",
                                                clubCrew.getCrew().getName() + "님이 "+ clubCrew.getClub().getName() + " 가입을 요청하였습니다.",
                                                    clubCrew.getClub(), crewTokens);

        return responseService.getSuccessResult();
    }

    // 모임 가입 신청 리스트 조회
    @Operation(summary = "모임 가입 신청 리스트 조회", description = "모임 가입 신청 리스트 조회")
    @GetMapping(value = "/{clubId}/crews/requests", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody SingleResult<PagingListResDTO<CrewReqsResDTO>> getRequestClubCrews(@PathVariable @NotBlank long clubId,
                                                                       @ParameterObject @PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) throws Exception {
        Page<ClubCrew> page = clubCrewService.getRequestClubCrews(clubId, getCurrentCrewId(), pageable);

        // 반환 DTO에 맞도록 가공
        List<CrewReqsResDTO> clubCrews = IntStream.range(0, page.getContent().size())
                .mapToObj(i -> page.getContent().get(i).toCrewReqsResDTO())
                .collect(Collectors.toList());

        PagingListResDTO pagingListResDTO = new PagingListResDTO(page, clubCrews);

        return responseService.getSingleResult(pagingListResDTO);
    }

    // 모임 가입 승인
    @Operation(summary = "모임 가입 승인", description = "모임 가입 승인")
    @PutMapping(value = "/crew/{clubCrewId}/request", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult approveClubCrew(@PathVariable @NotBlank long clubCrewId) throws Exception {
        ClubCrew clubCrew = clubCrewService.approve(clubCrewId, getCurrentCrewId());

        // 알림 전송
        List<CrewToken> crewTokens = crewTokenService.getNormalCrewToken(clubCrew.getCrew().getId());
        notificationService.createOneNotification(NotiCode.JOIN, null, "가입 승인 알림",
                clubCrew.getClub().getName() + " 가입 요청이 승인되었습니다.", clubCrew.getClub(), crewTokens);

        return responseService.getSuccessResult();
    }

    // 모임 가입 거절
    @Operation(summary = "모임 가입 거절", description = "모임 가입 거절")
    @DeleteMapping(value = "/crew/{clubCrewId}/request", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult refuseClubCrew(@PathVariable @NotBlank long clubCrewId) throws Exception {
        ClubCrew clubCrew = clubCrewService.refusal(clubCrewId, getCurrentCrewId());

        // 알림 전송
        List<CrewToken> crewTokens = crewTokenService.getNormalCrewToken(clubCrew.getCrew().getId());
        notificationService.createOneNotification(NotiCode.JOIN, null, "가입 거절 알림",
                clubCrew.getClub().getName() + " 가입 요청이 거절되었습니다.", clubCrew.getClub(), crewTokens);

        return responseService.getSuccessResult();
    }

    // 모임별 회원 리스트 조회
    @Operation(summary = "모임별 회원 리스트 조회", description = "모임별 회원 리스트 조회")
    @GetMapping(value = "/{clubId}/crews", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody SingleResult<PagingListResDTO<ClubCrewResDTO>> getClubCrews(@PathVariable @NotBlank long clubId,
                                                                                     @RequestParam(value="auth", defaultValue = "ALL") String auth,
                                                                                     @ParameterObject @PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) throws Exception {
        try {
            // String auth값 authCode로 변환
            AuthCode authCode = AuthCode.valueOf(auth);

            if (authCode == AuthCode.NONE) {
                throw new ApiMessageException("지원하지 않는 권한입니다.");
            }

            Page<ClubCrew> page = clubCrewService.getClubCrews(clubId, getCurrentCrewId(), authCode, pageable);

            // 반환 DTO에 맞도록 가공
            List<ClubCrewResDTO> clubCrews = IntStream.range(0, page.getContent().size())
                    .mapToObj(i -> page.getContent().get(i).toClubCrewResDTO())
                    .collect(Collectors.toList());

            PagingListResDTO pagingListResDTO = new PagingListResDTO(page, clubCrews);

            return responseService.getSingleResult(pagingListResDTO);
        } catch (IllegalArgumentException iae) {
            throw new ApiMessageException("지원하지 않는 권한입니다.");
        }
    }

    // 모임별 회원 관리자 권한 지정
    @Operation(summary = "모임별 회원 관리자 권한 지정", description = "모임별 회원 관리자 권한 지정")
    @PutMapping(value = "/crew/{clubCrewId}/auth/{auth}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult updateClubCrewAuth(@PathVariable @NotBlank long clubCrewId, @PathVariable @NotBlank String auth) throws Exception {
        try {
            AuthCode authCode = AuthCode.valueOf(auth);
            clubCrewService.updateAuth(clubCrewId, getCurrentCrewId(), authCode);
        } catch (IllegalArgumentException iae) {
            throw new ApiMessageException("지원하지 않는 권한입니다.");
        }

        return responseService.getSuccessResult();
    }

    // 모임 강퇴
    @Operation(summary = "모임 강퇴", description = "모임 강퇴")
    @DeleteMapping(value = "/crew/{clubCrewId}/kick", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult kickClubCrew(@PathVariable @NotBlank long clubCrewId) throws Exception {
        clubCrewService.kickClubCrew(clubCrewId, getCurrentCrewId());

        return responseService.getSuccessResult();
    }

    // 모임 탈퇴
    @Operation(summary = "모임 탈퇴", description = "모임 탈퇴")
    @DeleteMapping(value = "/{clubId}/crew", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult deleteClubCrew(@PathVariable @NotBlank long clubId) throws Exception {
        clubCrewService.deleteClubCrew(clubId, getCurrentCrewId());

        return responseService.getSuccessResult();
    }

    // 특정 회원의 특정 모임내 권한 조회
    @Operation(summary = "회원별 특정 모임내 권한 조회", description = "회원별 특정 모임내 권한 조회")
    @GetMapping(value = "/{clubId}/crew/auth", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody SingleResult<String> getClubCrewAuth(@PathVariable @NotBlank long clubId) throws Exception {
        AuthCode authCode = clubCrewService.getAuth(clubId, getCurrentCrewId());

        return responseService.getSingleResult(authCode.getValue());
    }
}
