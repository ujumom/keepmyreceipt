package com.ieung.receipt.dto.res;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.List;

@SuperBuilder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
// 페이징 결과를 담는 자식 클래스
public class PagingListResDTO<T> extends PageResDTO {
    private List<T> list;

    public PagingListResDTO(Page page, List<T> list) {
        super();
        setPageNumber(page.getNumber());
        setTotalPages(page.getTotalPages());
        setNumberOfElements(page.getNumberOfElements());
        setSize(page.getSize());
        setTotalElements(page.getTotalElements());
        setList(list);
    }
}
