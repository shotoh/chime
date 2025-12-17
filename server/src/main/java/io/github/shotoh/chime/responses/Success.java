package io.github.shotoh.chime.responses;

import lombok.experimental.SuperBuilder;

@SuperBuilder
public class Success extends Response {
	private final Object data;

	public static Response success(Object data) {
		return Success.builder().status("success").data(data).build();
	}
}
