package com.ieung.receipt.controller;

import com.ieung.receipt.dto.res.LargeCategoryResDTO;
import com.ieung.receipt.dto.res.ReportResDTO;
import com.ieung.receipt.dto.res.SmallCategoryResDTO;
import com.ieung.receipt.entity.Asset;
import com.ieung.receipt.entity.Budget;
import com.ieung.receipt.exception.ApiMessageException;
import com.ieung.receipt.service.ExcelService;
import com.ieung.receipt.service.ReportService;
import com.ieung.receipt.service.common.ListResult;
import com.ieung.receipt.service.common.ResponseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.time.YearMonth;
import java.util.*;

import static com.ieung.receipt.util.TokenUtil.getCurrentCrewId;

@Tag(name = "10. 보고서")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/spring")
public class ReportController {
    private final ReportService reportService;
    private final ExcelService excelService;
    private final ResponseService responseService;

    /**
     * 자산현황표 조회 : get /{clubId}/report/asset/date={date}
     * 자산현황표 다운로드 : get /{clubId}/report/asset/excel/date={date}
     * 예산운영표 조회 : get /{clubId}/report/budget/excel/date={date}
     * 예산운영표 다운로드 : get /{clubId}/report/budget/excel/date={date}
     */

    // 자산현황표 조회
    @Operation(summary = "자산현황표 조회", description = "자산현황표 조회")
    @GetMapping(value = "/{clubId}/report/asset", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ListResult<ReportResDTO> getAsset(@PathVariable @NotNull Long clubId, @RequestParam(value = "date",
                                                       defaultValue = "#{T(java.time.YearMonth).now()}") @DateTimeFormat(pattern = "yyyy-MM") YearMonth date) {
        List<Asset> list = reportService.getAsset(clubId, getCurrentCrewId(), date);

        if (list == null || list.size() == 0) {
            return responseService.getListResult(null);
        } else {
            // 자산별로 분류해서 result dto에 담기
            Map<String, Map<String, List<SmallCategoryResDTO>>> map = new HashMap<>();
            List<ReportResDTO> result = new ArrayList<>();

            for (Asset asset : list) {
                String type = asset.getType();
                String lcName = asset.getLcName();
                String scName = asset.getAscName();

                if (map.containsKey(type)) {
                    if (map.get(type).containsKey(lcName)) {
                        map.get(type).get(lcName).add(SmallCategoryResDTO.builder().scName(scName).balance(asset.getBalance()).build());
                    } else {
                        List<SmallCategoryResDTO> smallList = new ArrayList<>();
                        smallList.add(SmallCategoryResDTO.builder().scName(scName).balance(asset.getBalance()).build());
                        map.get(type).put(lcName, smallList);
                    }
                } else {
                    Map<String, List<SmallCategoryResDTO>> newMap = new HashMap<>();
                    List<SmallCategoryResDTO> smallList = new ArrayList<>();
                    smallList.add(SmallCategoryResDTO.builder().scName(scName).balance(asset.getBalance()).build());
                    newMap.put(lcName, smallList);
                    map.put(type, newMap);
                }
            }

            for (String type : map.keySet()) {
                List<LargeCategoryResDTO> largeList = new ArrayList<>();

                for (String lcName : map.get(type).keySet()) {
                    largeList.add(LargeCategoryResDTO.builder().lcName(lcName).list(map.get(type).get(lcName)).build());
                }

                result.add(ReportResDTO.builder().type(type).list(largeList).build());
            }

            return responseService.getListResult(result);
        }
    }

    // 자산현황표 엑셀로 저장
    @Operation(summary = "자산현황표 엑셀 파일로 저장", description = "자산현황표 엑셀 파일로 저장")
    @GetMapping(value = "/{clubId}/report/asset/excel", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody void excelDownload(HttpServletResponse response, @PathVariable @NotNull Long clubId, @RequestParam(value = "date",
            defaultValue = "#{T(java.time.YearMonth).now()}") @DateTimeFormat(pattern = "yyyy-MM") YearMonth date) throws IOException {
        List<Asset> list = reportService.getAsset(clubId, getCurrentCrewId(), date);

        if (list == null || list.size() == 0) {
            throw new ApiMessageException("해당하는 자료가 없습니다.");
        } else {
            // 자산별로 분류해서 result dto에 담기
            Map<String, Map<String, List<SmallCategoryResDTO>>> map = new HashMap<>();

            for (Asset asset : list) {
                String type = asset.getType();
                String lcName = asset.getLcName();
                String scName = asset.getAscName();

                if (map.containsKey(type)) {
                    if (map.get(type).containsKey(lcName)) {
                        map.get(type).get(lcName).add(SmallCategoryResDTO.builder().scName(scName).balance(asset.getBalance()).build());
                    } else {
                        List<SmallCategoryResDTO> smallList = new ArrayList<>();
                        smallList.add(SmallCategoryResDTO.builder().scName(scName).balance(asset.getBalance()).build());
                        map.get(type).put(lcName, smallList);
                    }
                } else {
                    Map<String, List<SmallCategoryResDTO>> newMap = new HashMap<>();
                    List<SmallCategoryResDTO> smallList = new ArrayList<>();
                    smallList.add(SmallCategoryResDTO.builder().scName(scName).balance(asset.getBalance()).build());
                    newMap.put(lcName, smallList);
                    map.put(type, newMap);
                }
            }

            // 엑셀 변환
            SXSSFWorkbook wb = excelService.toExcel(date, map,"자산현황표");

            // 컨텐츠 타입과 파일명 지정
            response.setContentType("ms-vnd/excel");
            response.setHeader("Content-Disposition", "attachment;filename=asset.xlsx");

            // Excel File Output
            wb.write(response.getOutputStream());
            wb.close();
        }
    }

    // 예산운영표 조회
    @Operation(summary = "예산운영표 조회", description = "예산운영표 조회")
    @GetMapping(value = "/{clubId}/report/budget", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ListResult<ReportResDTO> getBudget(@PathVariable @NotNull Long clubId, @RequestParam(value = "date",
            defaultValue = "#{T(java.time.YearMonth).now()}") @DateTimeFormat(pattern = "yyyy-MM") YearMonth date) {
        List<Budget> list = reportService.getBudget(clubId, getCurrentCrewId(), date);

        if (list == null || list.size() == 0) {
            return responseService.getListResult(null);
        } else {
            // 분류별로 result dto에 담기
            Map<String, Map<String, List<SmallCategoryResDTO>>> map = new HashMap<>();
            List<ReportResDTO> result = new ArrayList<>();

            for (Budget budget : list) {
                String type = budget.getType();
                String lcName = budget.getLcName();
                String scName = budget.getBscName();

                if (map.containsKey(type)) {
                    if (map.get(type).containsKey(lcName)) {
                        map.get(type).get(lcName).add(SmallCategoryResDTO.builder().scName(scName).balance(budget.getChanges()).build());
                    } else {
                        List<SmallCategoryResDTO> smallList = new ArrayList<>();
                        smallList.add(SmallCategoryResDTO.builder().scName(scName).balance(budget.getChanges()).build());
                        map.get(type).put(lcName, smallList);
                    }
                } else {
                    Map<String, List<SmallCategoryResDTO>> newMap = new HashMap<>();
                    List<SmallCategoryResDTO> smallList = new ArrayList<>();
                    smallList.add(SmallCategoryResDTO.builder().scName(scName).balance(budget.getChanges()).build());
                    newMap.put(lcName, smallList);
                    map.put(type, newMap);
                }
            }

            for (String type : map.keySet()) {
                List<LargeCategoryResDTO> largeList = new ArrayList<>();

                for (String lcName : map.get(type).keySet()) {
                    largeList.add(LargeCategoryResDTO.builder().lcName(lcName).list(map.get(type).get(lcName)).build());
                }

                result.add(ReportResDTO.builder().type(type).list(largeList).build());
            }

            return responseService.getListResult(result);
        }
    }

    // 예산운영표 조회
    @Operation(summary = "예산운영표 엑셀 파일로 저장", description = "예산운영표 엑셀 파일로 저장")
    @GetMapping(value = "/{clubId}/report/budget/excel", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody void toExcelBudget(HttpServletResponse response, @PathVariable @NotNull Long clubId, @RequestParam(value = "date",
            defaultValue = "#{T(java.time.YearMonth).now()}") @DateTimeFormat(pattern = "yyyy-MM") YearMonth date) throws IOException {
        List<Budget> list = reportService.getBudget(clubId, getCurrentCrewId(), date);

        if (list == null || list.size() == 0) {
            throw new ApiMessageException("해당하는 자료가 없습니다.");
        } else {
            // 분류별로 result dto에 담기
            Map<String, Map<String, List<SmallCategoryResDTO>>> map = new HashMap<>();

            for (Budget budget : list) {
                String type = budget.getType();
                String lcName = budget.getLcName();
                String scName = budget.getBscName();

                if (map.containsKey(type)) {
                    if (map.get(type).containsKey(lcName)) {
                        map.get(type).get(lcName).add(SmallCategoryResDTO.builder().scName(scName).balance(budget.getChanges()).build());
                    } else {
                        List<SmallCategoryResDTO> smallList = new ArrayList<>();
                        smallList.add(SmallCategoryResDTO.builder().scName(scName).balance(budget.getChanges()).build());
                        map.get(type).put(lcName, smallList);
                    }
                } else {
                    Map<String, List<SmallCategoryResDTO>> newMap = new HashMap<>();
                    List<SmallCategoryResDTO> smallList = new ArrayList<>();
                    smallList.add(SmallCategoryResDTO.builder().scName(scName).balance(budget.getChanges()).build());
                    newMap.put(lcName, smallList);
                    map.put(type, newMap);
                }
            }

            // 엑셀 변환
            SXSSFWorkbook wb = excelService.toExcel(date, map,"예산운영표");

            // 컨텐츠 타입과 파일명 지정
            response.setContentType("ms-vnd/excel");
            response.setHeader("Content-Disposition", "attachment;filename=budget.xlsx");

            // Excel File Output
            wb.write(response.getOutputStream());
            wb.close();
        }
    }
}
