package io.github.shotoh.chime.exceptions;

import java.util.Map;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ResourceNotFoundException extends BaseException {
	public ResourceNotFoundException(Map<String, String> errorMap) {
		super(errorMap);
	}

	public ResourceNotFoundException(String resource, String message) {
		super(resource, message);
	}

	@Override
	public HttpStatus getHttpStatus() {
		return HttpStatus.NOT_FOUND;
	}
}
