package io.github.shotoh.chime.exceptions;

import java.util.Map;
import org.springframework.http.HttpStatus;

public class InvalidArgumentException extends BaseException {
	public InvalidArgumentException(Map<String, String> errorMap) {
		super(errorMap);
	}

	public InvalidArgumentException(String resource, String message) {
		super(resource, message);
	}

	@Override
	public HttpStatus getHttpStatus() {
		return HttpStatus.BAD_REQUEST;
	}
}
