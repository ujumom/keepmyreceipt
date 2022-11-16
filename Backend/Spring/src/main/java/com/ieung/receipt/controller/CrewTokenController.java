package com.ieung.receipt.controller;

import com.ieung.receipt.code.YNCode;
import com.ieung.receipt.dto.req.FCMTokenReqDTO;
import com.ieung.receipt.dto.req.LoginReqDTO;
import com.ieung.receipt.dto.req.TokenReqDTO;
import com.ieung.receipt.dto.res.TokenResDTO;
import com.ieung.receipt.service.CrewTokenService;
import com.ieung.receipt.service.common.CommonResult;
import com.ieung.receipt.service.common.ResponseService;
import com.ieung.receipt.service.common.SingleResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import static com.ieung.receipt.util.TokenUtil.getCurrentCrewId;

@Tag(name = "02. 토큰")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/spring/crew")
public class CrewTokenController {
    private final CrewTokenService crewTokenService;
    private final ResponseService responseService;

    /**
     * 로그인 : post /login
     * 로그아웃 : post /logout
     * 토큰 재발급 : put /token/reissue
     * 푸시 알림 허용 : put /token/push/allow
     * 푸시 알림 비허용 : put /token/push/disallow
     * 푸시 알림 상태 확인 : get /token/push/allow
     */

    // 로그인
    @Operation(summary = "로그인", description = "로그인")
    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    SingleResult<TokenResDTO> login(@Valid @RequestBody LoginReqDTO loginReqDTO) throws Exception {
        TokenResDTO tokenResDTO = crewTokenService.login(loginReqDTO.getEmail(), loginReqDTO.getPassword(), loginReqDTO.getFcmToken());

        return responseService.getSingleResult(tokenResDTO);
    }

    // 로그아웃
    @Operation(summary = "로그아웃", description = "로그아웃")
    @PostMapping(value = "/logout", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult logout(@Valid @RequestBody FCMTokenReqDTO fcmTokenReqDTO) throws Exception {
        crewTokenService.logout(getCurrentCrewId(), fcmTokenReqDTO.getFcmToken());

        return responseService.getSuccessResult();
    }

    // 토큰 재발급
    @Operation(summary = "토큰 재발급", description = "accessToken 만료시 refreshToken으로 토큰 재발급")
    @PutMapping(value = "/token/reissue", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody SingleResult<TokenResDTO> reissue(@Valid @RequestBody TokenReqDTO tokenReqDTO) throws Exception {
        TokenResDTO tokenResDTO = crewTokenService.reissue(tokenReqDTO);

        return responseService.getSingleResult(tokenResDTO);
    }

    // 푸시 알림 허용
    @Operation(summary = "푸시 알림 허용", description = "푸시 알림 허용")
    @PutMapping(value = "/token/push/allow", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult allowPush(@Valid @RequestBody FCMTokenReqDTO fcmTokenReqDTO) throws Exception {
        crewTokenService.allowPush(getCurrentCrewId(), fcmTokenReqDTO.getFcmToken());

        return responseService.getSuccessResult();
    }

    // 푸시 알림 비허용
    @Operation(summary = "푸시 알림 비허용", description = "푸시 알림 비허용")
    @PutMapping(value = "/token/push/disallow", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult disallowPush(@Valid @RequestBody FCMTokenReqDTO fcmTokenReqDTO) throws Exception {
        crewTokenService.disallowPush(getCurrentCrewId(), fcmTokenReqDTO.getFcmToken());

        return responseService.getSuccessResult();
    }

    // 푸시 알림 상태 조회
    @Operation(summary = "푸시 알림 상태 조회", description = "푸시 알림 상태 조회")
    @PostMapping(value = "/token/push", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody SingleResult<Boolean> getIsAllowedPush(@Valid @RequestBody FCMTokenReqDTO fcmTokenReqDTO) throws Exception {
        YNCode isAllowedPush = crewTokenService.getIsAllowedPush(getCurrentCrewId(), fcmTokenReqDTO.getFcmToken());

        return responseService.getSingleResult(isAllowedPush == YNCode.Y);
    }
}
