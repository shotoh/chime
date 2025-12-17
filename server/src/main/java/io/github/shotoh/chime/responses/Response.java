package io.github.shotoh.chime.responses;

import lombok.experimental.SuperBuilder;

@SuperBuilder
public abstract class Response {
	private final String status;
}
