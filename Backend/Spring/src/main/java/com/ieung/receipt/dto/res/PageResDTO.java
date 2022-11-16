package com.ieung.receipt.dto.res;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
@ToString
@NoArgsConstructor
// 페이징 정보를 담는 부모 클래스
public abstract class PageResDTO {
    @Schema(description = "현재 페이지 번호", required = true, example = "1")
    private int pageNumber;

    @Schema(description = "한 페이지의 크기", required = true, example = "1")
    private int size;

    @Schema(description = "전체 페이지의 수", required = true, example = "1")
    private int totalPages;

    @Schema(description = "결과 데이터의 수", required = true, example = "1")
    private int numberOfElements;

    @Schema(description = "전체 데이터의 수", required = true, example = "1")
    private long totalElements;
}
