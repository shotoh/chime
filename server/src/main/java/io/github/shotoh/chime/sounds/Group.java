package io.github.shotoh.chime.sounds;

import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.annotation.Id;

public record Group(@Id UUID id, String name, int order, boolean enabled, Set<Sound> sounds, Set<Group> subGroups) {
	public Group() {
		this(UUID.randomUUID(), "New Group", 0, true, Collections.emptySet(), Collections.emptySet());
	}
}
