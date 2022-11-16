package com.ieung.receipt.controller;

import com.ieung.receipt.dto.req.AssetSCategoryReqDTO;
import com.ieung.receipt.dto.req.BudgetSCategoryReqDTO;
import com.ieung.receipt.dto.req.LCategoryReqDTO;
import com.ieung.receipt.dto.res.AssetSCategoryResDTO;
import com.ieung.receipt.dto.res.BudgetSCategoryResDTO;
import com.ieung.receipt.dto.res.LCategoryResDTO;
import com.ieung.receipt.service.CategoryService;
import com.ieung.receipt.service.common.CommonResult;
import com.ieung.receipt.service.common.ListResult;
import com.ieung.receipt.service.common.ResponseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Tag(name = "08. 계정과목(대분류, 소분류)")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/spring")
public class CategoryController {
    private final CategoryService categoryService;
    private final ResponseService responseService;

    /**
     * 대분류 생성 : post /lcategory
     * 대분류 조회 : get /lcategory/{type}
     * 예산 소분류 생성 : post /bscategory
     * 예산 소분류 조회 : get /bscategory/{clubId}/{lcName}
     * 예산 소분류 수정 : put /bscategory/{bscId}
     * 예산 소분류 삭제 : delete /bscategory/{bscId}
     * 자산 소분류 생성 : post /ascategory
     * 자산 소분류 조회 : get /ascategory/{clubId}/{lcName}
     * 자산 소분류 수정 : put /ascategory/{ascId}
     * 자산 잔액 업데이트 : put /ascategory/{ascId}/{balance}
     * 자산 소분류 삭제 : delete /ascategory/{ascId}
     */

    // 대분류 생성
    @Operation(summary = "대분류 생성", description = "사용자가 사용 X")
    @PostMapping(value = "/lcategory", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult createLCategory(@Valid @RequestBody LCategoryReqDTO lCategoryReqDTO) throws Exception{
        categoryService.creatLCategory(lCategoryReqDTO);
        return responseService.getSuccessResult();
    }

    // 대분류 조회
    @Operation(summary = "대분류 조회", description = "유형을 기준으로 대분류 조회")
    @GetMapping(value = "/lcategory/{type}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ListResult getLCategory(@PathVariable @NotBlank String type) throws Exception{
        List<LCategoryResDTO> lCategoryResDTOList = categoryService.getLCategoryByType(type);
        return responseService.getListResult(lCategoryResDTOList);
    }

    // 예산 소분류 생성
    @Operation(summary = "예산 소분류 생성")
    @PostMapping(value = "/bscategory", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult createBSCategory(@Valid @RequestBody BudgetSCategoryReqDTO budgetSCategoryReqDTO) throws Exception{
        categoryService.createBudgetSCategory(budgetSCategoryReqDTO);
        return responseService.getSuccessResult();
    }

    // 예산 소분류 조회
    @Operation(summary = "예산 소분류 조회")
    @GetMapping(value = "/bscategory/{clubId}/{lcName}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ListResult findBSCategory(@PathVariable @NotBlank Long clubId, @PathVariable @NotBlank String lcName) throws Exception{
        List<BudgetSCategoryResDTO> budgetSCategoryResDTOList = categoryService.findBudgetSCList(clubId, lcName);
        return responseService.getListResult(budgetSCategoryResDTOList);
    }

    // 예산 소분류 수정
    @Operation(summary = "예산 소분류 수정")
    @PutMapping(value = "/bscategory/{bscId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult updateBSCategory(@Valid @RequestBody BudgetSCategoryReqDTO budgetSCategoryReqDTO, @PathVariable @NotBlank Long bscId) throws Exception{
        categoryService.updateBSC(bscId, budgetSCategoryReqDTO);
        return responseService.getSuccessResult();
    }

    // 예산 소분류 삭제
    @Operation(summary = "예산 소분류 삭제")
    @DeleteMapping(value = "/bscategory/{bscId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult deleteBSCategory(@PathVariable @NotBlank Long bscId) throws Exception{
        categoryService.deleteBSC(bscId);
        return responseService.getSuccessResult();
    }

    // 자산 소분류 생성
    @Operation(summary = "자산 소분류 생성")
    @PostMapping(value = "/ascategory", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult createASCategory(@Valid @RequestBody AssetSCategoryReqDTO assetSCategoryReqDTO) throws Exception{
        categoryService.createAssetSCategory(assetSCategoryReqDTO);
        return responseService.getSuccessResult();
    }

    // 자산 소분류 조회
    @Operation(summary = "자산 소분류 조회")
    @GetMapping(value = "/ascategory/{clubId}/{lcName}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ListResult findASCategory(@PathVariable @NotBlank Long clubId, @PathVariable @NotBlank String lcName) throws Exception{
        List<AssetSCategoryResDTO> assetSCategoryResDTOList = categoryService.findAssetSCList(clubId, lcName);
        return responseService.getListResult(assetSCategoryResDTOList);
    }

    // 자산 소분류 수정
    @Operation(summary = "자산 소분류 수정")
    @PutMapping(value = "/ascategory/{ascId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult updateASCategory(@Valid @RequestBody AssetSCategoryReqDTO assetSCategoryReqDTO, @PathVariable @NotBlank Long ascId) throws Exception{
        categoryService.updateASC(ascId, assetSCategoryReqDTO);
        return responseService.getSuccessResult();
    }

    // 자산 잔액 업데이트
    @Operation(summary = "자산 소분류 잔액 업데이트")
    @PutMapping(value = "/ascategory/{ascId}/{newBalace}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult updateBalance(@PathVariable @NotBlank Long ascId, @PathVariable @NotBlank int newBalace) throws Exception{
        categoryService.updateBalance(ascId, newBalace);
        return responseService.getSuccessResult();
    }

    // 자산 소분류 삭제
    @Operation(summary = "자산 소분류 삭제")
    @DeleteMapping(value = "/ascategory/{ascId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult deleteASCategory(@PathVariable @NotBlank Long ascId) throws Exception{
        categoryService.deleteASC(ascId);
        return responseService.getSuccessResult();
    }
}
