package com.ieung.receipt.advice;

import com.ieung.receipt.service.common.CommonResult;
import com.ieung.receipt.service.common.ResponseService;
import com.ieung.receipt.exception.ApiMessageException;
import com.ieung.receipt.exception.CAuthenticationEntryPointException;
import com.ieung.receipt.exception.CUserNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;
import javax.validation.UnexpectedTypeException;

@RequiredArgsConstructor
@Slf4j
// 예외 처리 + 객체를 리턴
@RestControllerAdvice
public class ExceptionAdvice {
    private final ResponseService responseService;
    private final MessageSource messageSource;

    @ExceptionHandler(CAuthenticationEntryPointException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public CommonResult authenticationEntryPointException(HttpServletRequest request, CAuthenticationEntryPointException e) {
        log.info(getMessage("entryPointException.msg"));
        return responseService.getFailResult(Integer.valueOf(getMessage("entryPointException.code")), getMessage("entryPointException.msg"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public CommonResult accessDeniedException(HttpServletRequest request, AccessDeniedException e) {
        log.info(getMessage("accessDenied.msg"));
        return responseService.getFailResult(Integer.valueOf(getMessage("accessDenied.code")), getMessage("accessDenied.msg"));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    protected CommonResult dataIntegrityException(HttpServletRequest request, DataIntegrityViolationException e) {
        log.info(getMessage("unKnown.msg"));
        return responseService.getFailResult(Integer.valueOf(getMessage("unKnown.code")), getMessage("unKnown.msg"));
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    protected CommonResult defaultException(HttpServletRequest request, Exception e) {
        e.printStackTrace();
        // 예외 처리의 메시지를 MessageSource에서 가져오도록 수정
        log.info(getMessage("unKnown.msg"));
        return responseService.getFailResult(Integer.valueOf(getMessage("unKnown.code")), getMessage("unKnown.msg"));
    }

    @ExceptionHandler(BindException.class)
    @ResponseStatus(HttpStatus.OK)
    protected CommonResult defaultException(HttpServletRequest request, BindException e) {
        // validation
        e.printStackTrace();
        log.info(getMessage("dataNotExistError.msg"));
        return responseService.getFailResult(0, getMessage("dataNotExistError.msg"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.OK)
    protected CommonResult defaultException(HttpServletRequest request, MethodArgumentNotValidException e) {
        // validation
        e.printStackTrace();
        log.info(getMessage("dataNotExistError.msg"));
        return responseService.getFailResult(0, getMessage("dataNotExistError.msg"));
    }

    @ExceptionHandler(UnexpectedTypeException.class)
    @ResponseStatus(HttpStatus.OK)
    protected CommonResult defaultException(HttpServletRequest request, UnexpectedTypeException e) {
        // validation
        e.printStackTrace();
        log.info(getMessage("dataNotExistError.msg"));
        return responseService.getFailResult(0, getMessage("dataNotExistError.msg"));
    }

    @ExceptionHandler(CUserNotFoundException.class)
    @ResponseStatus(HttpStatus.OK)
    protected CommonResult userNotFound(HttpServletRequest request, CUserNotFoundException e) {
        log.info(getMessage("userNotFound.msg"));
        return responseService.getFailResult(0, getMessage("userNotFound.msg"));
    }

    @ExceptionHandler(ApiMessageException.class)
    @ResponseStatus(HttpStatus.OK)
    protected CommonResult communicationException(HttpServletRequest request, ApiMessageException e) {
        return responseService.getFailResult(0, e.getMessage());
    }

    // code정보에 해당하는 메시지를 조회합니다.
    private String getMessage(String code) {
        return getMessage(code, null);
    }

    // code정보, 추가 argument로 현재 locale에 맞는 메시지를 조회합니다.
    private String getMessage(String code, Object[] args) {
        return messageSource.getMessage(code, args, LocaleContextHolder.getLocale());
    }
}
