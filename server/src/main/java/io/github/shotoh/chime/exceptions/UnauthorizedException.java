package io.github.shotoh.chime.exceptions;

import java.util.Map;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class UnauthorizedException extends BaseException {
	public UnauthorizedException(Map<String, String> errorMap) {
		super(errorMap);
	}

	public UnauthorizedException(String resource, String message) {
		super(resource, message);
	}

	@Override
	public HttpStatus getHttpStatus() {
		return HttpStatus.UNAUTHORIZED;
	}
}
