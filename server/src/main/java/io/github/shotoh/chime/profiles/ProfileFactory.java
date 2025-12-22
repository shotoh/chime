package io.github.shotoh.chime.profiles;

import io.github.shotoh.chime.sounds.Group;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Collections;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class ProfileFactory {
	private final SecureRandom random = new SecureRandom();
	private final Base64.Encoder encoder = Base64.getEncoder();

	public Profile createNew() {
		return new Profile(UUID.randomUUID(), generateToken(), "New Profile", Instant.now().toEpochMilli(), createGroup());
	}

	public Group createGroup() {
		return new Group(UUID.randomUUID(), "New Group", 0, true, Collections.emptySet(), Collections.emptySet());
	}

	private String generateToken() {
		byte[] tokenBytes = new byte[32];
		random.nextBytes(tokenBytes);
		return encoder.encodeToString(tokenBytes);
	}
}
