package io.github.shotoh.chime.profiles;

import io.github.shotoh.chime.exceptions.ResourceNotFoundException;
import io.github.shotoh.chime.sounds.Group;
import io.github.shotoh.chime.sounds.Sound;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {
	private final ProfileRepository repository;
	private final ProfileMapper mapper;
	private final SecureRandom random;
	private final Base64.Encoder encoder;

	@Autowired
	public ProfileService(ProfileRepository repository, ProfileMapper mapper) {
		this.repository = repository;
		this.mapper = mapper;
		this.random = new SecureRandom();
		this.encoder = Base64.getEncoder();
	}

	public ProfileNoTokenDTO getProfile(UUID id) {
		Profile profile = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", "profile not found"));
		return mapper.toDTO(profile);
	}

	public Profile createProfile() {
		Profile profile = new Profile(UUID.randomUUID(), generateToken(), "New Profile", Instant.now().toEpochMilli(), createDefaultGroup());
		repository.save(profile);
		return profile;
	}

	public Profile cloneProfile(UUID id) {
		Profile original = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("id", "profile not found"));
		return new Profile(UUID.randomUUID(), generateToken(), original.name(), Instant.now().toEpochMilli(), cloneGroup(original.rootGroup()));
	}

	private Group createDefaultGroup() {
		return new Group(UUID.randomUUID(), "New Group", 0, true, Collections.emptySet(), Collections.emptySet());
	}

	private Group cloneGroup(Group group) {
		Set<Group> subGroups = group.subGroups().stream().map(this::cloneGroup).collect(Collectors.toSet());
		return new Group(UUID.randomUUID(), group.name(), group.order(), group.enabled(), group.sounds(), subGroups);
	}

	private Sound cloneSound(Sound sound) {
		return new Sound(UUID.randomUUID(), sound.soundId(), sound.delay(), sound.volume(), sound.pitch(), sound.order(), sound.enabled());
	}

	private String generateToken() {
		byte[] tokenBytes = new byte[32];
		random.nextBytes(tokenBytes);
		return encoder.encodeToString(tokenBytes);
	}
}
