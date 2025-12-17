package io.github.shotoh.chime.profiles;

import io.github.shotoh.chime.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {
	private final ProfileRepository repository;

	@Autowired
	public ProfileService(ProfileRepository repository) {
		this.repository = repository;
	}

	public Profile getProfile(String id) {
		return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", "profile not found"));
	}
}
