package com.ieung.receipt.dto.req;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.NumberFormat;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PastOrPresent;
import java.time.LocalDate;
import java.util.List;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class TransactionReqDTO {
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @PastOrPresent
    @Schema(description = "거래 날짜", example = "2022-05-01")
    private LocalDate date;

    @NumberFormat(style = NumberFormat.Style.NUMBER)
    @Schema(description = "금액", example = "15000")
    private int totalPrice;

    @Schema(description = "연관 영수증 청구 내역 id", example = "1")
    private Long requestId;

    @NotNull
    @Valid
    @Schema(description = "세부 거래 항목", required = true)
    private List<TransactionDetailReqDTO> list;
}
