package com.ieung.receipt.util;

import com.ieung.receipt.entity.Crew;
import com.ieung.receipt.exception.CAuthenticationEntryPointException;
import org.springframework.security.core.context.SecurityContextHolder;

public class TokenUtil {
    private TokenUtil() {}

    public static Long getCurrentCrewId() {
        Object details = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (details != null && !(details instanceof String) && details instanceof Crew) {
            return ((Crew) details).getId();
        }

        throw new CAuthenticationEntryPointException();
    }
}
