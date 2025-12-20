package io.github.shotoh.chime.profiles;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.github.shotoh.chime.sounds.Group;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;
import org.springframework.data.annotation.Id;

public record Profile(@Id UUID id, @JsonIgnore String token, String name, long timestamp, Group rootGroup) {
	public Profile() {
		this(new Group());
	}

	public Profile(Group rootGroup) {
		SecureRandom random = new SecureRandom();
		Base64.Encoder encoder = Base64.getUrlEncoder().withoutPadding();

		byte[] tokenBytes = new byte[32];
		random.nextBytes(tokenBytes);
		String token = encoder.encodeToString(tokenBytes);

		this(UUID.randomUUID(), token, "New Profile", Instant.now().toEpochMilli(), rootGroup);
	}
}
