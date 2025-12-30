package io.github.shotoh.chime.profiles;

import io.github.shotoh.chime.sounds.Group;
import java.util.UUID;

public record ProfileDTO(UUID id, String name, Group rootGroup) {
}
