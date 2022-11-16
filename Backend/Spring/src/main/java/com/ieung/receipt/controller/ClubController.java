package com.ieung.receipt.controller;

import com.ieung.receipt.code.YNCode;
import com.ieung.receipt.dto.req.ClubReqDTO;
import com.ieung.receipt.dto.res.ClubResDTO;
import com.ieung.receipt.dto.res.PagingListResDTO;
import com.ieung.receipt.entity.Club;
import com.ieung.receipt.entity.Crew;
import com.ieung.receipt.service.CrewService;
import com.ieung.receipt.service.ClubService;
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

@Tag(name = "03. 모임")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/spring")
public class ClubController {
    private final CrewService crewService;
    private final ClubService clubService;
    private final ResponseService responseService;

    /**
     * 모임 생성 : post /club
     * 가입한 모임 조회 : get /clubs/joined
     * 가입 신청한 모임 조회 : get/clubs/requested
     * 모임 조회 : get /club/{clubId}
     * 모임 리스트 조회 : get /clubs?page=0&size=10&sort=id,ASC
     * 모임 삭제 : delete /clubs/{clubId}
     * 모임 정보 수정 : put /club/{clubId}
     * 대분류 활성화 여부 확인 : get /club/{clubId}/isActiveCategory
     * 대분류 활성화 : put /club/{clubId}/isActiveCategory/active
     * 대분류 비활성화 : put /club/{clubId}/isActiveCategory/inactive
     */

    // 모임 생성
    @Operation(summary = "모임 생성", description = "모임 생성")
    @PostMapping(value = "/club", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult createClub(@Valid @RequestBody ClubReqDTO clubReqDTO) throws Exception {
        Crew crew = crewService.findCrewById(getCurrentCrewId());

        clubService.createClub(crew, clubReqDTO);

        return responseService.getSuccessResult();
    }

    // 가입한 모임 조회
    @Operation(summary = "가입한 모임 조회", description = "가입한 모임 조회")
    @GetMapping(value = "/clubs/joined", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody SingleResult<PagingListResDTO<ClubResDTO>> getJoinedClub( @ParameterObject @PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) throws Exception {
        Page<Club> page = clubService.getJoinedClubs(getCurrentCrewId(), pageable);

        // 반환 DTO에 맞도록 가공
        List<ClubResDTO> clubs = IntStream.range(0, page.getContent().size())
                .mapToObj(i -> page.getContent().get(i).toClubResDTO())
                .collect(Collectors.toList());

        PagingListResDTO pagingListResDTO = new PagingListResDTO(page, clubs);

        return responseService.getSingleResult(pagingListResDTO);
    }

    // 가입 신청한 모임 조회
    @Operation(summary = "가입 신청한 모임 조회", description = "가입 신청한 모임 조회")
    @GetMapping(value = "/clubs/requested", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody SingleResult<PagingListResDTO<ClubResDTO>> getRequestClub(@ParameterObject @PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) throws Exception {
        Page<Club> page = clubService.getRequestedClubs(getCurrentCrewId(), pageable);

        // 반환 DTO에 맞도록 가공
        List<ClubResDTO> clubs = IntStream.range(0, page.getContent().size())
                .mapToObj(i -> page.getContent().get(i).toClubResDTO())
                .collect(Collectors.toList());

        PagingListResDTO pagingListResDTO = new PagingListResDTO(page, clubs);

        return responseService.getSingleResult(pagingListResDTO);
    }

    // 특정 모임 조회
    @Operation(summary = "특정 모임 조회", description = "특정 모임 조회")
    @GetMapping(value = "/club/{clubId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody SingleResult<ClubResDTO> getClub(@PathVariable @NotBlank long clubId) throws Exception {
        Club club = clubService.getClub(clubId);

        ClubResDTO clubResDTO = club.toClubResDTO();

        return responseService.getSingleResult(clubResDTO);
    }

    // 모임 검색
    @Operation(summary = "모임 검색", description = "제목으로 모임 검색")
    @GetMapping(value = "/clubs", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody SingleResult<PagingListResDTO<ClubResDTO>> createGroup(@RequestParam(value = "name", defaultValue = "") String name,
                                                                                @ParameterObject @PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) throws Exception {
        Page<Club> page = clubService.getClubs(name, pageable);

        // 반환 DTO에 맞도록 가공
        List<ClubResDTO> clubs = IntStream.range(0, page.getContent().size())
                .mapToObj(i -> page.getContent().get(i).toClubResDTO())
                .collect(Collectors.toList());

        PagingListResDTO pagingListResDTO = new PagingListResDTO(page, clubs);

        return responseService.getSingleResult(pagingListResDTO);
    }

    // 모임 삭제
    @Operation(summary = "모임 삭제", description = "모임 삭제")
    @DeleteMapping(value = "/club/{clubId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult deleteClub(@PathVariable @NotBlank long clubId) throws Exception {
        clubService.deleteClub(getCurrentCrewId(), clubId);

        return responseService.getSuccessResult();
    }

    // 모임 정보 수정
    @Operation(summary = "모임 정보 수정", description = "모임 정보 수정")
    @PutMapping(value = "/club/{clubId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult updateClub(@PathVariable @NotBlank long clubId,
                                                 @Valid @RequestBody ClubReqDTO clubReqDTO) throws Exception {
        clubService.updateClub(getCurrentCrewId(), clubId, clubReqDTO);

        return responseService.getSuccessResult();
    }

    // 대분류 활성화 여부 확인
    @Operation(summary = "대분류 활성화 여부 확인", description = "대분류 활성화 여부 확인")
    @GetMapping(value = "/club/{clubId}/isActiveCategory", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody SingleResult<Boolean> getIsActiveCategory(@PathVariable @NotBlank long clubId) {
        YNCode result = clubService.getIsActiveCategory(getCurrentCrewId(), clubId);

        return responseService.getSingleResult(result == YNCode.Y);
    }

    // 대분류 활성화
    @Operation(summary = "대분류 활성화", description = "대분류 활성화")
    @PutMapping(value = "/club/{clubId}/isActiveCategory/active", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult activeCategory(@PathVariable @NotBlank long clubId) {
        clubService.activeCategory(getCurrentCrewId(), clubId);

        return responseService.getSuccessResult();
    }

    // 대분류 비활성화
    @Operation(summary = "대분류 비활성화", description = "대분류 비활성화")
    @PutMapping(value = "/club/{clubId}/isActiveCategory/inactive", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult inActiveCategory(@PathVariable @NotBlank long clubId) {
        clubService.inactiveCategory(getCurrentCrewId(), clubId);

        return responseService.getSuccessResult();
    }
}