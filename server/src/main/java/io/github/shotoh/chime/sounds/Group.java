package io.github.shotoh.chime.sounds;

import java.util.Set;
import java.util.UUID;
import org.springframework.data.annotation.Id;

public record Group(@Id UUID id, String name, int order, boolean enabled, Set<Sound> sounds, Set<Group> subGroups) {
}
