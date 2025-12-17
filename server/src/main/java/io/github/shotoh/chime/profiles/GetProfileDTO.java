package io.github.shotoh.chime.profiles;

import io.github.shotoh.chime.sounds.GetGroupDTO;
import java.util.UUID;

public record GetProfileDTO(UUID id, String name, GetGroupDTO rootGroup) {
}
