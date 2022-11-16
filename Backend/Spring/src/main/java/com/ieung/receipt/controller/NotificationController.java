package com.ieung.receipt.controller;

import com.ieung.receipt.dto.res.NotiResDTO;
import com.ieung.receipt.dto.res.PagingListResDTO;
import com.ieung.receipt.entity.Notification;
import com.ieung.receipt.service.NotificationService;
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

@Tag(name = "05. 알림")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/spring")
public class NotificationController {
    private final NotificationService notificationService;
    private final ResponseService responseService;

    /**
     * 알림 목록 조회 : get /notifications?page=0&size=10&sort=id,ASC
     * 알림 읽음 처리 : put /notification/{notificationId}
     * 알림 삭제 : delete /notification/{notificationId}
     */

    // 알림 목록 조회
    @Operation(summary = "알림 목록 조회", description = "알림 목록 조회")
    @GetMapping(value = "/notifications", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody SingleResult<PagingListResDTO<NotiResDTO>> getNotifications(@ParameterObject @PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<Notification> page = notificationService.getNotifications(getCurrentCrewId(), pageable);

        List<NotiResDTO> notis = IntStream.range(0, page.getContent().size())
                .mapToObj(i -> page.getContent().get(i).toNotiResDTO())
                .collect(Collectors.toList());

        PagingListResDTO pagingListResDTO = new PagingListResDTO(page, notis);

        return responseService.getSingleResult(pagingListResDTO);
    }

    // 알림 읽음 처리
    @Operation(summary = "알림 읽음 처리", description = "알림 읽음 처리")
    @PutMapping(value = "/notification/{notificationId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult readNotification(@PathVariable @NotBlank long notificationId) {
        notificationService.readNotification(getCurrentCrewId(), notificationId);

        return responseService.getSuccessResult();
    }

    // 알림 삭제
    @Operation(summary = "알림 삭제", description = "알림 삭제")
    @DeleteMapping(value = "/notification/{notificationId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult deleteNotification(@PathVariable @NotBlank long notificationId) {
        notificationService.deleteNotification(getCurrentCrewId(), notificationId);

        return responseService.getSuccessResult();
    }
}
