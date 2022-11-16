package com.ieung.receipt.service.common;


import com.ieung.receipt.service.common.CommonResult;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SingleResult<T> extends CommonResult {
    private T data;
}
