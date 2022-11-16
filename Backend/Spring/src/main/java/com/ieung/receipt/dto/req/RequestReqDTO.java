package com.ieung.receipt.dto.req;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.hibernate.validator.constraints.URL;
import org.springframework.format.Formatter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.NumberFormat;

import javax.validation.constraints.*;
import java.time.LocalDate;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RequestReqDTO {
    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @PastOrPresent
    @Schema(description = "지불 날짜", required = true, example = "2022-05-01")
    private LocalDate date;

    @NotNull
    @NumberFormat(style = NumberFormat.Style.NUMBER)
    @Schema(description = "금액", required = true, example = "15000")
    private int price;

    @NotBlank
    @URL
    @Schema(description = "영수증 url", required = true, example = "http://k6d104.p.ssafy.io:5555/images/20220507&H1145b84d1a341adcc87041b11b3e382348d3.jpg")
    private String receiptUrl;
}
