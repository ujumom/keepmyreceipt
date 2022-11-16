package com.ieung.receipt.service;

import com.ieung.receipt.dto.res.SmallCategoryResDTO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class ExcelService {
    /**
     * 엑셀 파일 생성
     * @param date, map, title
     * @return SXSSFWorkbook
     */
    public SXSSFWorkbook toExcel(YearMonth date, Map<String, Map<String, List<SmallCategoryResDTO>>> map, String title) {
        List<String>  typeList =  new ArrayList<>(Arrays.asList("자산", "예산", "수입", "지출"));

        SXSSFWorkbook wb = new SXSSFWorkbook();
        Sheet sheet = wb.createSheet(title);
        Row row = null;

        int rowNum = 0;

        // cellStyle 생성
        XSSFCellStyle centerStyle = createCellStyle(wb, "CENTER", null, false, 0);
        XSSFCellStyle rightStyle = createCellStyle(wb, "RIGHT", null, false, 0);
        XSSFCellStyle typeTotalStyle = createCellStyle(wb, "LEFT", null, true, 0);
        XSSFCellStyle typeTotalNumStyle = createCellStyle(wb, "RIGHT", null, true, 0);
        XSSFCellStyle typeStyle = createCellStyle(wb, "LEFT", new XSSFColor(new byte[] {(byte) 255,(byte) 242,(byte) 204}, null), false, 0);
        XSSFCellStyle headerStyle = createCellStyle(wb, "CENTER", null, true, 500);

        for (int i = 0; i < 4; i++) {
            sheet.setColumnWidth(i, 3000);
        }

        // Header
        row = sheet.createRow(rowNum++);
        createCell(row, headerStyle, title, 0);
        rowNum++;
        sheet.addMergedRegion(new CellRangeAddress(0, 1, 0, 3));
        row = sheet.createRow(rowNum++);
        createCell(row, centerStyle, date.toString(), 0);
        sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 3));
        row = sheet.createRow(rowNum++);
        createCell(row, rightStyle, "(단위: 원)", 0);
        sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 3));
        row = sheet.createRow(rowNum++);
        createCell(row, null, "과목", 0);
        sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 2));
        createCell(row, null, "금액", 3);

        // 항목별로 데이터 채우기
        for (String type : typeList) {
            if (!map.containsKey(type)) {
                continue;
            }

            row = sheet.createRow(rowNum++);
            createCell(row, typeStyle, type, 0);
            sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 3));

            int typeTotal = 0;

            // 대분류별 기입
            for (String lcName : map.get(type).keySet()) {
                int lcTotal = 0;

                row = sheet.createRow(rowNum++);
                createCell(row, null, lcName, 1);
                sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 1, 2));

                // 소분류별 기입
               for (SmallCategoryResDTO smallCategoryResDTO : map.get(type).get(lcName)) {
                    row = sheet.createRow(rowNum++);
                    createCell(row, null, smallCategoryResDTO.getScName(), 2);
                    createCell(row, null, smallCategoryResDTO.getBalance(), 3);

                    lcTotal += smallCategoryResDTO.getBalance();
                }

                typeTotal += lcTotal;
            }

            // 총계 표시
            row = sheet.createRow(rowNum++);
            createCell(row, typeTotalStyle, "총 " + type, 0);
            sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 2));
            createCell(row, typeTotalNumStyle, typeTotal, 3);
        }

        return wb;
    }

    /**
     * cell 생성 (문자열)
     * @param row, style, value, columnNum
     */
    public void createCell(Row row, XSSFCellStyle style, String value, int columnNum) {
        Cell cell = row.createCell(columnNum);
        cell.setCellValue(value);

        if (style != null) {
            cell.setCellStyle(style);
        }
    }

    /**
     * cell 생성 (숫자)
     * @param row, style, value, columnNum
     */
    public void createCell(Row row, XSSFCellStyle style, int value, int columnNum) {
        Cell cell = row.createCell(columnNum);
        cell.setCellValue(value);

        if (style != null) {
            cell.setCellStyle(style);
        }
    }

    /**
     * cell style 생성
     */
    public XSSFCellStyle createCellStyle(SXSSFWorkbook wb, String align, XSSFColor color, boolean isBold, int height) {
        XSSFCellStyle style = (XSSFCellStyle) wb.createCellStyle();

        if (align.equals("CENTER")) {
            style.setAlignment(HorizontalAlignment.CENTER);
        } else if (align.equals("LEFT")) {
            style.setAlignment(HorizontalAlignment.LEFT);
        } else {
            style.setAlignment(HorizontalAlignment.RIGHT);
        }

        if (color != null) {
            style.setFillForegroundColor(color);
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        }

        if (isBold || height != 0) {
            Font font = wb.createFont();
            font.setFontName("맑은 고딕");

            if (height != 0) {
                font.setFontHeight((short)height);
            }

            if (isBold) {
                font.setBold(true);
            }

            style.setFont(font);
        }

        return style;
    }
}
