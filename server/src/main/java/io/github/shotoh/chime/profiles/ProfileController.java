package io.github.shotoh.chime.profiles;

import io.github.shotoh.chime.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class ProfileController {
	private final ProfileRepository repository;

	@Autowired
	public ProfileController(ProfileRepository repository) {
		this.repository = repository;
	}

	public Profile getProfile(String id) {
		return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", "profile not found"));
	}
}
