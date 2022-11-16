package com.ieung.receipt.code;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum NotiCode implements BaseEnumCode<String> {

    JOIN("가입"),
    CHARGE("청구");

    private final String value;
}
