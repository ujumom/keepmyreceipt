package com.ieung.receipt.code;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
// 권한 상태로 사용될 상태 코드값
public enum AuthCode implements BaseEnumCode<String> {

    LEADER("리더"),
    MANAGER("관리자"),
    NORMAL("회원"),
    NONE("대기"),
    ALL("all"); // 검색에만 사용

    private final String value;
}
