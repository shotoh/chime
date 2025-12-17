package io.github.shotoh.chime.responses;

import lombok.experimental.SuperBuilder;

@SuperBuilder
public class Error extends Response {
	private final String message;

	public static Response error(String message) {
		return Error.builder().status("error").message(message).build();
	}
}
