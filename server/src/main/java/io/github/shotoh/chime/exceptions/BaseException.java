package io.github.shotoh.chime.exceptions;

import io.github.shotoh.chime.responses.Fail;
import io.github.shotoh.chime.responses.Response;
import java.util.HashMap;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@AllArgsConstructor
@Getter
public abstract class BaseException extends RuntimeException {
	private final Map<String, String> errorMap;

	public BaseException(String resource, String message) {
		errorMap = new HashMap<>();
		errorMap.put(resource, message);
	}

	public abstract HttpStatus getHttpStatus();

	public ResponseEntity<Response> getResponse() {
		return ResponseEntity.status(getHttpStatus()).body(Fail.builder().data(errorMap).build());
	}
}
