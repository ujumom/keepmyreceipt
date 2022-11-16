package com.ieung.receipt.dto.res;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class BookResDTO {
    @Schema(description = "수입", example = "10000")
    private Integer income;

    @Schema(description = "지출", example = "1000")
    private Integer expenditure;

    @Schema(description = "페이징 결과")
    private PagingListResDTO<TransactionDetailSimpleResDTO> result;
}
