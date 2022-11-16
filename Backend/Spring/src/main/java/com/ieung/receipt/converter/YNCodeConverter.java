package com.ieung.receipt.converter;



import com.ieung.receipt.code.YNCode;

import javax.persistence.Converter;


@Converter(autoApply = true)
// YN 코드값의 Converter
public class YNCodeConverter extends AbstractBaseEnumConverter<YNCode, String> {

    @Override
    protected YNCode[] getValueList() {
        return YNCode.values();
    }
}
