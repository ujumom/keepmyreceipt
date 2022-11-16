package com.ieung.receipt.dto.req;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.springframework.format.annotation.NumberFormat;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDetailReqDTO {
    @NotBlank
    @Schema(description = "항목명", required = true, example = "왕맛있는그레놀라에너지바")
    private String name;

    @NotNull
    @NumberFormat(style = NumberFormat.Style.NUMBER)
    @Schema(description = "금액", required = true, example = "15000")
    private Integer price;

    @Pattern(regexp = "자산|지출|수입|예산")
    @Schema(description = "유형", required = true, example = "자산/지출/수입/예산")
    private String type;

    @Schema(description = "1차 태그", example = "주전부리")
    private String largeTag;

    @Schema(description = "2차 태그", example = "초코바")
    private String smallTag;

    @Schema(description = "대분류", required = true, example = "복리후생비")
    private String largeCategory;

    @Schema(description = "소분류", required = true, example = "식비")
    private String smallCategory;

    @Schema(description = "메모", example = "부회장이 고름")
    private String memo;

}
