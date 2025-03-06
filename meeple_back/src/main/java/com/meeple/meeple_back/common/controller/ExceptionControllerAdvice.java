package com.meeple.meeple_back.common.controller;

import static org.springframework.http.HttpStatus.NOT_FOUND;

import com.meeple.meeple_back.common.domain.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
public class ExceptionControllerAdvice {

	@ResponseBody
	@ResponseStatus(NOT_FOUND)
	@ExceptionHandler(ResourceNotFoundException.class)
	public String resourceNotFoundException(ResourceNotFoundException exception) {
		return exception.getMessage();
	}
}
