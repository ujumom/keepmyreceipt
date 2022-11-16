package com.ieung.receipt.converter;

import com.ieung.receipt.code.AuthCode;
import com.ieung.receipt.code.StateCode;

import javax.persistence.Converter;

@Converter(autoApply = true)
// 상태 코드값의 Converter
public class StateCodeConverter extends AbstractBaseEnumConverter<StateCode, String> {
    @Override
    protected StateCode[] getValueList() {
        return StateCode.values();
    }
}
