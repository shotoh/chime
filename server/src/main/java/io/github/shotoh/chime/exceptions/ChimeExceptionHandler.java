package io.github.shotoh.chime.exceptions;

import io.github.shotoh.chime.responses.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ChimeExceptionHandler {
	@ExceptionHandler(BaseException.class)
	public ResponseEntity<Response> handleException(BaseException ex) {
		return ex.getResponse();
	}
}
