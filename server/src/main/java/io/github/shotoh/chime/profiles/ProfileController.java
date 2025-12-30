package io.github.shotoh.chime.profiles;

import io.github.shotoh.chime.responses.Response;
import io.github.shotoh.chime.responses.Success;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/profiles")
public class ProfileController {
	private final ProfileService service;

	@Autowired
	public ProfileController(ProfileService service) {
		this.service = service;
	}

	@GetMapping("/{id}")
	@ResponseStatus(HttpStatus.OK)
	public Response getProfile(@PathVariable UUID id) {
		return Success.success(service.getProfile(id));
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Response createProfile() {
		return Success.success(service.createProfile());
	}

	@PostMapping("/{id}")
	@ResponseStatus(HttpStatus.CREATED)
	public Response cloneProfile(@PathVariable UUID id) {
		return Success.success(service.cloneProfile(id));
	}

	@PatchMapping("/{id}")
	@ResponseStatus(HttpStatus.OK)
	public Response updateProfile(@PathVariable UUID id, @RequestHeader("Authorization") String token, @RequestBody ProfileUpdateDTO profileUpdateDTO) {
		return Success.success(service.updateProfile(id, token, profileUpdateDTO));
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.OK)
	public Response deleteProfile(@PathVariable UUID id, @RequestHeader("Authorization") String token) {
		service.deleteProfile(id, token);
		return Success.success(null);
	}
}
