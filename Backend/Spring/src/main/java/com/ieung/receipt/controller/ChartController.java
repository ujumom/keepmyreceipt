package com.ieung.receipt.controller;

import com.ieung.receipt.dto.res.ChartGraphResDTO;
import com.ieung.receipt.dto.res.ChartResDTO;
import com.ieung.receipt.service.ChartService;
import com.ieung.receipt.service.common.CommonResult;
import com.ieung.receipt.service.common.ResponseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotBlank;
import java.time.YearMonth;
import java.util.List;

@Tag(name = "11. 차트")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/spring")
public class ChartController {
    private final ChartService chartService;
    private final ResponseService responseService;

    /**
     * 1차 차트 데이터 : get /chart/{clubId}/{yearMonth}
     * 2차 차트 데이터 : get /chart/{clubId}/{yearMonth}/{parentTag}
     */

    @Operation(summary = "1차 차트", description = "1차 차트 데이터")
    @GetMapping(value = "/chart/{clubId}/{year}/{month}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult getFirstChart(@PathVariable @NotBlank Long clubId, @PathVariable @NotBlank int year, @PathVariable @NotBlank int month){
        YearMonth yearMonth = YearMonth.of(year, month);
        List<ChartResDTO> chartResDTOList = chartService.getParentChartData(clubId, yearMonth);
        return responseService.getListResult(chartResDTOList);
    }

    @Operation(summary = "2차 차트", description = "2차 차트 데이터")
    @GetMapping(value = "/chart/{clubId}/{year}/{month}/{parentTag}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody CommonResult getSecondChart(@PathVariable @NotBlank Long clubId, @PathVariable @NotBlank int year, @PathVariable @NotBlank int month, @PathVariable @NotBlank String parentTag){
        YearMonth yearMonth = YearMonth.of(year, month);
        List<ChartResDTO> chartResDTOList = chartService.getChildChartData(clubId, yearMonth, parentTag);
        return responseService.getListResult(chartResDTOList);
    }

    @Operation(summary = "꺾은선 그래프", description = "꺾은선 그래프에 사용될 월별 거래 금액")
    @GetMapping(value = "/chart/line/{clubId}/{year}/{month}")
    public @ResponseBody CommonResult getLineChart(@PathVariable @NotBlank Long clubId, @PathVariable @NotBlank int year, @PathVariable @NotBlank int month){
        List<ChartGraphResDTO> chartGraphResDTOList = chartService.getChartGraph(clubId, year, month);
        return responseService.getListResult(chartGraphResDTOList);
    }
}
