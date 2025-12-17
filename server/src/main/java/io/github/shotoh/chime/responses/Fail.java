package io.github.shotoh.chime.responses;

import lombok.experimental.SuperBuilder;

@SuperBuilder
public class Fail extends Response {
	private final Object data;

	public static Response fail(Object data) {
		return Fail.builder().status("fail").data(data).build();
	}
}
