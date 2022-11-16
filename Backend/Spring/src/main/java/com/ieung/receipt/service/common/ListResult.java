package com.ieung.receipt.service.common;

import com.ieung.receipt.service.common.CommonResult;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class ListResult<T> extends CommonResult {
    private List<T> data;
}
