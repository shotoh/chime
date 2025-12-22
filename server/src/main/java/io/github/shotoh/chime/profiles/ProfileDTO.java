package io.github.shotoh.chime.profiles;

import io.github.shotoh.chime.sounds.GroupDTO;
import java.util.UUID;

public record ProfileDTO(UUID id, String name, GroupDTO rootGroup) {
}
