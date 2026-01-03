package io.github.shotoh.chime.core;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record Response(String status, Object data, String message) {
	public static Response success(Object data) {
		return new Response("success", data, null);
	}

	public static Response fail(Object data) {
		return new Response("success", data, null);
	}

	public static Response error(String message) {
		return new Response("success", null, message);
	}
}
