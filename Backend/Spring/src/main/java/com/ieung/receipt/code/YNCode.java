package com.ieung.receipt.code;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
// YN 여부로 사용될 코드값
public enum YNCode implements BaseEnumCode<String> {

    Y("Y"),
    N("N"),
    YES("Y"),
    NO("N"),
    DKNOW("D");

    private final String value;
}
