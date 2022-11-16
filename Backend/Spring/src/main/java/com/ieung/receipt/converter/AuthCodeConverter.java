package com.ieung.receipt.converter;

import com.ieung.receipt.code.AuthCode;

import javax.persistence.Converter;

@Converter(autoApply = true)
// 상태 코드값의 Converter
public class AuthCodeConverter extends AbstractBaseEnumConverter<AuthCode, String> {
    @Override
    protected AuthCode[] getValueList() {
        return AuthCode.values();
    }
}
