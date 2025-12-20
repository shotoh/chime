package io.github.shotoh.chime.profiles;

import io.github.shotoh.chime.sounds.Group;
import java.util.UUID;

public record ProfileNoTokenDTO(UUID id, String name, long timestamp, Group rootGroup) {
}
