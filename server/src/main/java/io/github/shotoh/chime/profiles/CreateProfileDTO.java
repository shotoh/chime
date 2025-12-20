package io.github.shotoh.chime.profiles;

import io.github.shotoh.chime.sounds.GetGroupDTO;
import java.util.UUID;

public record CreateProfileDTO(UUID id, String token, String name, GetGroupDTO rootGroup) {
}
