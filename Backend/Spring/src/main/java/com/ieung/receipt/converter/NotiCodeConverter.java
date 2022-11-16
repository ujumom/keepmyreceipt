package com.ieung.receipt.converter;

import com.ieung.receipt.code.NotiCode;

import javax.persistence.Converter;

@Converter(autoApply = true)
// 상태 코드값의 Converter
public class NotiCodeConverter extends AbstractBaseEnumConverter<NotiCode, String> {
    @Override
    protected NotiCode[] getValueList() {
        return NotiCode.values();
    }
}
